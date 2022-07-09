pragma solidity ^0.8.10;

import { IConditionalTokens } from "./interface/IConditionalTokens.sol";
// import { IFPMM } from "./interface/IConditionalTokens.sol";
import { Ownable } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Reporter is Ownable{
    IConditionalTokens public immutable conditionalTokens;

    struct QuestionData {
        uint256 result;
        /// @notice Unix timestamp(in seconds) at which a market can be resolved
        uint256 resolutionTime;
        /// @notice Reward offered to a successful proposer
        uint256 settled;
        /// @notice Request timestmap, set when a request is made to the Optimistic Oracle
        bool resolved;
        /// @notice Data used to resolve a condition
        bytes ancillaryData;
    }

    mapping(bytes32 => QuestionData) public questions;
    // mapping(bytes32 => IFPMM) public FPMMs;

    event questionInitialized(
        bytes32 questionID,
        bytes ancillaryData,
        uint256 resolutionTime);

    event questionPrepared(bytes32 questionID, uint outcomeSlotCount);

    event questionSettled(bytes32 questionID, uint price);

    constructor(address addr) public{
        conditionalTokens = IConditionalTokens(addr);
    }

    function initializeQuestion(
        bytes32 questionID,
        bytes memory ancillaryData,
        uint256 resolutionTime
        ) public onlyOwner {

        require(!isInitialized(questionID), "Question has been initialized");
        require(resolutionTime > 0, "Invalid resolution time, must be greater than 0");

        questions[questionID] = QuestionData({
            result: 1000,
            ancillaryData: ancillaryData,
            resolutionTime: resolutionTime,
            resolved: false,
            settled: 0
        });

        emit questionInitialized(
            questionID,
            ancillaryData,
            resolutionTime);
    }

    function prepareQuestion(bytes32 questionID, uint outcomeSlotCount) public onlyOwner returns (bytes32) {
        conditionalTokens.prepareCondition(address(this), questionID, outcomeSlotCount);

        emit questionPrepared(questionID, outcomeSlotCount);

        return conditionalTokens.getConditionId(address(this), questionID, outcomeSlotCount);
    }

    function settleQuestion(bytes32 questionID, uint price) external onlyOwner {
        require(isInitialized(questionID), "Question must be initialized");
        require(block.timestamp >= questions[questionID].resolutionTime);
        QuestionData storage questionData = questions[questionID];
        require(price == 1 || price == 0);
        questionData.settled = block.number;
        questionData.result = price;
        questionData.resolved = true;
        uint256[] memory payout = new uint256[](2);
        payout[price] = 1;
        payout[1 - price] = 0;
        conditionalTokens.reportPayouts(questionID, payout);

        emit questionSettled(questionID, price);
    }


    function isInitialized(bytes32 questionID) public view returns (bool){
        return questions[questionID].resolutionTime > 0;
    }

    function initializeAndPrepare(
        bytes32 questionID,
        bytes memory ancillaryData,
        uint256 resolutionTime,
        uint outcomeSlotCount) external onlyOwner returns (bytes32) 
    {
        initializeQuestion(questionID, ancillaryData, resolutionTime);
        return prepareQuestion(questionID, outcomeSlotCount);
    }
}
