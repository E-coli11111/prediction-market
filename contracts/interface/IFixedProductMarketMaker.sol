pragma solidity ^0.8.10;

interface IFPMM {
    
    event FPMMFundingAdded(
        address indexed funder,
        uint[] amountsAdded,
        uint sharesMinted
    );
    event FPMMFundingRemoved(
        address indexed funder,
        uint[] amountsRemoved,
        uint collateralRemovedFromFeePool,
        uint sharesBurnt
    );
    event FPMMBuy(
        address indexed buyer,
        uint investmentAmount,
        uint feeAmount,
        uint indexed outcomeIndex,
        uint outcomeTokensBought
    );
    event FPMMSell(
        address indexed seller,
        uint returnAmount,
        uint feeAmount,
        uint indexed outcomeIndex,
        uint outcomeTokensSold
    );

    function owner() public view returns (address) external;

    function renounceOwnership() external;

    function transferOwnership(address newOwner) external;

    function setCloseTime(uint _closeTime) external;

    function setOwner(address _owner) external;

    function collectedFees() external view returns (uint);

    function feesWithdrawableBy(address account) external view returns (uint);

    function withdrawFees(address account) external;

    function addFunding(uint addedFunds, uint[] calldata distributionHint) external;

    function removeFunding(uint sharesToBurn) external;

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    )
        external
        returns (bytes4);

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    )
        external
        returns (bytes4);

    function calcBuyAmount(uint investmentAmount, uint outcomeIndex) external view returns (uint);

    function calcSellAmount(uint returnAmount, uint outcomeIndex) external view returns (uint outcomeTokenSellAmount);

    function buy(uint investmentAmount, uint outcomeIndex, uint minOutcomeTokensToBuy) external;

    function sell(uint returnAmount, uint outcomeIndex, uint maxOutcomeTokensToSell) external;
}
