pragma solidity ^0.8.10;

import { IFPMM } from "./interface/IFPMM.sol";
import { IConditionalTokens } from "./interface/IConditionalTokens.sol";
import { ERC1155 } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/token/ERC1155/ERC1155.sol";
import { IERC20 } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/token//ERC20/IERC20.sol";
// import { IERC1155Receiver } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/IERC1155Receiver.sol";
import { ERC165 } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/utils/introspection/ERC165.sol";
import { Ownable } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/access/Ownable.sol";
import { SafeMath } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/utils/math/SafeMath.sol";

//: 10115665526
// This interface is copied from openzepplin implementation. Only IERC165 inheritance is removed since it is inherited in ERC1155
interface IERC1155Receiver{
    /**
     * @dev Handles the receipt of a single ERC1155 token type. This function is
     * called at the end of a `safeTransferFrom` after the balance has been updated.
     *
     * @notice To accept the transfer, this must return
     * `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
     * (i.e. 0xf23a6e61, or its own function selector).
     *
     * @param operator The address which initiated the transfer (i.e. msg.sender)
     * @param from The address which previously owned the token
     * @param id The ID of the token being transferred
     * @param value The amount of tokens being transferred
     * @param data Additional data with no specified format
     * @return `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed
     */
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4);

    /**
     * @dev Handles the receipt of a multiple ERC1155 token types. This function
     * is called at the end of a `safeBatchTransferFrom` after the balances have
     * been updated.
     *
     * @notice To accept the transfer(s), this must return
     * `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
     * (i.e. 0xbc197c81, or its own function selector).
     *
     * @param operator The address which initiated the batch transfer (i.e. msg.sender)
     * @param from The address which previously owned the token
     * @param ids An array containing ids of each token being transferred (order and length must match values array)
     * @param values An array containing amounts of each token being transferred (order and length must match ids array)
     * @param data Additional data with no specified format
     * @return `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed
     */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4);
}



contract FPMMProxy is Ownable, ERC1155, IERC1155Receiver{

    event Buy(
        address indexed buyer,
        uint indexed SponsorID,
        address indexed fpmm,
        uint puff,
        uint usdc,
        uint outcomeIndex
    );

    event Sell(
        address indexed seller,
        uint indexed sponsorID,
        address indexed fpmm,
        uint puff,
        uint usdc,
        uint outcomeIndex
    );

    using SafeMath for uint;

    IERC20 public collateralToken;
    IConditionalTokens public conditionalToken;
    
    mapping(address => uint) register;
    mapping(uint => uint) public deadlines;
    mapping(uint => mapping(address => uint)) public conditionalTokenBalances;
    mapping(address => bool) public isRedeemable;


    constructor(address conditional, address collateral) ERC1155(""){
        conditionalToken = IConditionalTokens(conditional);
        collateralToken = IERC20(collateral);
    }
    

    /**
     * @dev Invest in a particular contract in exchange for conditional tokens.
     * User can use puff token and collateral token at the same time. The portion
     * of conditional token for the puff token will be locked in this contract unless
     * user sell or redeem them.
     *
     * @notice User are required to approve this contract to transfer `investUsdc`.
     * 
     * @param sponsorID The sponsor ID of puff token.
     * @param fpmm The address of the market to interact. `fpmm` must be registered under `sponsorID` in advance.
     * @param investPuff The amount of puff token
     * @param investUsdc The amount of collateralt token
     * @param outcomeIndex The outcome that is going to buy (yes or no)
     * @param minOutcomeTokensToBuy The minimum amount of conditional token needs to receive
     */
    function buy(
        uint sponsorID, 
        address fpmm, 
        uint investPuff, 
        uint investUsdc, 
        uint outcomeIndex, 
        uint minOutcomeTokensToBuy
    ) external{
        require(block.timestamp < deadlines[sponsorID], "Proxy::Token for sponsor has expired");
        require(register[fpmm] == sponsorID, "Proxy::FPMM not registered for sponsor.");
        require(!isRedeemable[fpmm], "Proxy::Cannot transact during the redeem period");
        require(collateralToken.transferFrom(msg.sender, address(this), investUsdc), "Proxy::Collateral transfer failed");

        IFPMM FPMM = IFPMM(fpmm);
        
        require(FPMM.getConditionalTokens() == address(conditionalToken), "Proxy::Don't support FPMM with different conditional token address");

        uint investAmount = investPuff.add(investUsdc);
        uint position = FPMM.getPositionId(outcomeIndex);

        uint outcomeTokensToBuy = FPMM.calcBuyAmount(investAmount, outcomeIndex);
        uint usdcReturn = outcomeTokensToBuy.mul(investUsdc).div(investAmount); // The amount of conditional token that needs to return to user Bug
        uint puffReturn = outcomeTokensToBuy.sub(usdcReturn); // The amount of conditional token locked in this contract)

        // Buy process
        _burn(msg.sender, sponsorID, investPuff); // Deduct Puff tokens for user
        collateralToken.approve(fpmm, investAmount);
        FPMM.buy(investAmount, outcomeIndex, minOutcomeTokensToBuy); // Buy conditional token in batch

        conditionalToken.safeTransferFrom(address(this), msg.sender, position, usdcReturn, "");
        conditionalTokenBalances[FPMM.getPositionId(outcomeIndex)][msg.sender] += puffReturn;

        emit Buy(msg.sender, sponsorID, fpmm, investPuff, investUsdc, outcomeIndex);
    }


    /**
     * @dev Selling holding conditional tokens for USDC. Conditional tokens 
     * that is locked in proxy can only return Puff token. 
     * 
     * @notice User need to approve this contract to transfer user's conditional token
     * 
     * @param sponsorID The sponsor ID of puff token.
     * @param fpmm The address of the market to interact. `fpmm` must be registered under `sponsorID` in advance.
     * @param returnPuff The amount of puff token to be returned
     * @param returnUsdc The amount of collateralt token to be returned
     * @param outcomeIndex The outcome that is going to sell (yes or no)
     * @param maxOutcomeTokensToSell The maximum amount of conditional token can be spent
     */
    function sell(
        uint sponsorID,
        address fpmm, 
        uint returnPuff, 
        uint returnUsdc, 
        uint outcomeIndex, 
        uint maxOutcomeTokensToSell
    ) external{
        require(block.timestamp < deadlines[sponsorID], "Proxy::Token for sponsor has expired");
        require(register[fpmm] == sponsorID, "Proxy::FPMM not registered for sponsor.");
        require(!isRedeemable[fpmm], "Proxy::Cannot transact during the redeem period");

        IFPMM FPMM = IFPMM(fpmm);

        require(FPMM.getConditionalTokens() == address(conditionalToken), "Proxy::Don't support FPMM with different conditional token address");
        
        uint returnAmount = returnPuff.add(returnUsdc);
        uint position = FPMM.getPositionId(outcomeIndex);
        
        uint outcomeTokensToSell = FPMM.calcSellAmount(returnAmount, outcomeIndex);
        uint usdcNeeded = outcomeTokensToSell.mul(returnUsdc).div(returnAmount); // The number of the conditional token from user's EOA
        uint puffNeeded = outcomeTokensToSell.sub(usdcNeeded); // The number of the conditional token in Proxy

        
        require(conditionalTokenBalances[FPMM.getPositionId(outcomeIndex)][msg.sender] >= puffNeeded, "Proxy::No enough outcome token.");
        conditionalTokenBalances[FPMM.getPositionId(outcomeIndex)][msg.sender] -= puffNeeded;

        // Sell process
        conditionalToken.safeTransferFrom(msg.sender, address(this), position, usdcNeeded, "");
        conditionalToken.setApprovalForAll(fpmm, true);
        FPMM.sell(returnAmount, outcomeIndex, maxOutcomeTokensToSell);

        _mint(msg.sender, sponsorID, returnPuff, "");
        require(collateralToken.transfer(msg.sender, returnUsdc), "Proxy::Collateral transfer failed");

        emit Sell(msg.sender, sponsorID, fpmm, returnPuff, returnUsdc, outcomeIndex);
    }

    function registerFPMM(uint sponsorID, address fpmm) onlyOwner external{
        if(sponsorID != 0){
            require(IFPMM(fpmm).getConditionalTokens() == address(conditionalToken), "Proxy::Don't support FPMM with different conditional token address");
            require(IFPMM(fpmm).getCollateral() == address(collateralToken), "Proxy::Collateral token must be the same");
        }
        register[fpmm] = sponsorID;
    }

    function redeem(address fpmm) external{
        IFPMM FPMM = IFPMM(fpmm);

        require(isRedeemable[fpmm], "Proxy::Cannot redeem yet");
        require(FPMM.getConditionalTokens() == address(conditionalToken), "Proxy::Don't support FPMM with different conditional token address");
        
        bytes32 condition = FPMM.conditionIds(0);
        // require(conditions.length == 1, "Multiple condition FPMM not supported");
        uint den = IConditionalTokens(FPMM.getConditionalTokens()).payoutDenominator(condition);
        require(den > 0, "Question not yet resolved");
        IConditionalTokens conditional = IConditionalTokens(FPMM.getConditionalTokens());
        
        uint numOutcome = conditional.getOutcomeSlotCount(condition);
        uint tokenToPay = 0;
        for (uint i = 0; i < numOutcome; i++){
            uint payout = conditional.payoutNumerators(condition, i);
            tokenToPay += payout.mul(conditionalTokenBalances[FPMM.getPositionId(i)][msg.sender]);
            conditionalTokenBalances[FPMM.getPositionId(i)][msg.sender] = 0;
        }
        tokenToPay = tokenToPay.div(den);
        require(collateralToken.transfer(msg.sender, tokenToPay), "Proxy::Collateral transfer failed");

    }

    function setRedeem(address fpmm, bool status) onlyOwner external {
        require(register[fpmm] != 0, "Proxy::FPMM not registered for sponsor.");
        if(status){
            
            IFPMM FPMM = IFPMM(fpmm);
            IConditionalTokens conditional = IConditionalTokens(FPMM.getConditionalTokens());
            bytes32 condition = FPMM.conditionIds(0);
            // require(conditions.length == 1, "Multiple condition FPMM not supported");
            // require(false, "Test 0");
            uint numOutcome = conditional.getOutcomeSlotCount(condition);
            uint[] memory indexSets = new uint[](numOutcome);
            for (uint i = 0; i < numOutcome; i++){
                uint indexSet = 1 << i;
                indexSets[i] = indexSet;
                
            }
            conditional.redeemPositions(collateralToken, 0, condition, indexSets);     
        }
        isRedeemable[fpmm] = status;
    }

    function setDeadline(uint sponsorID, uint time) onlyOwner external{
        deadlines[sponsorID] = time;
    }

    function getPoolBalance() public view returns (uint){
        return collateralToken.balanceOf(address(this));
    }

    function mint(address account, uint sponsorID, uint256 amount) external onlyOwner{
        _mint(account, sponsorID, amount, "");
    }

    function getShares(address fpmm, uint[] memory index) external view returns (uint[] memory){
        // require(fpmm.length == index.length, "FPMMs and indices length mismatch");

        uint[] memory batchShares = new uint[](index.length);
        for (uint256 i = 0; i < index.length; ++i) {
            batchShares[i] = conditionalTokenBalances[IFPMM(fpmm).getPositionId(index[i])][msg.sender];
        }
        return batchShares;
    }

    function withdraw(uint collateral) external onlyOwner{
        require(collateralToken.transfer(owner(), collateral), "withdrawal transfer failed");
    }




//////////////////////////////////////////
//////ERC1155ReceiverImplementation///////
//////////////////////////////////////////
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    )
        view
        external
        returns (bytes4)
    {
        if (operator == address(this) || register[operator] != 0) {
            return this.onERC1155Received.selector;
        }
        return 0x0;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    )
        view
        external
        returns (bytes4)
    {
        if (operator == address(this) || register[operator] != 0){
            return this.onERC1155BatchReceived.selector;
        }
        return 0x0;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    }
}
