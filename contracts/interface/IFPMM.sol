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


    function calcBuyAmount(uint investmentAmount, uint outcomeIndex) external view returns (uint);
    function calcSellAmount(uint returnAmount, uint outcomeIndex) external view returns (uint outcomeTokenSellAmount);
    function buy(uint investmentAmount, uint outcomeIndex, uint minOutcomeTokensToBuy) external;
    function sell(uint returnAmount, uint outcomeIndex, uint maxOutcomeTokensToSell) external;   
    function getPositionId(uint index) external view returns(uint);
    function getConditionalTokens() external view returns(address);
    function getCollateral() external view returns(address);
    function conditionIds(uint) external view returns(bytes32);
}
