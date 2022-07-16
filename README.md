# prediction-market

Reporter: Rinkeby `0x49fCBe66031171D8Ee2d656E39A4E1d146AE3D24`  
Factory: Rinkeby `0x0A5DAd97E0686A6d3568B2c447A0D022a80b6836`

## 用法
 - 运行```yarn install```配置环境
 - 运行```npm install @remix-project/remixd```安装remixd
 - 运行```remixd -s ./ https://remix.ethereum.org```连接remix ide
 - 在remix ide上连接localhost部署合约
 
## 合约
### Reporter.sol
负责在conditional token上创建问题并汇报结果  
合约构造器需要传入已部署的conditionalTokens合约的地址
可调用函数（已测试）：
 - ```initializeQuestion(bytes32 questionID, bytes memory ancillaryData, uint256 resolutionTime)```负责在合约中记录发起的问题的数据，只有合约所有者能调用  
 - ```prepareQuestion(bytes32 questionID, uint outcomeSlotCount)```调用conditionalToken并在其中初始化一个问题，返回在conditionalToken中的条件ID  
 - ```settleQuestion(bytes32 questionID, uint price)```报告结果  
 - ```isInitialized(bytes32 questionID)```判断某个问题是否已初始化  
 - ```initializeAndPrepare(bytes32 questionID, bytes memory ancillaryData, uint256 resolutionTime, uint outcomeSlotCount)```结合两个函数以节省gas费用  
 - 其他合约所有者相关函数

### TestToken.sol  
测试用ERC20代币

### FPMMFactory.sol
用于创建FPMM合约  
可调用函数（已测试）：
 - ```cloneConstructor(bytes calldata consData)```克隆合约时的构造函数
 - ```createFixedProductMarketMaker(ConditionalTokens conditionalTokens, IERC20 collateralToken, bytes32[] calldata conditionIds, uint fee, uint managerFee, uint closeTime)```创建FPMM合约  
    ```condtionalTokens```已部署的conditionalTokens地址  
    ```collateralToken```AMM所使用的ERC20代币  
    ```conditionIds```AMM涉及的条件ID  
    ```fee```流动性提供者可以获得的交易费用（PS. 10^18代表100%的费用）  
    ```managerFee```协议收取的费用  
    ```closeTime```停止交易的时间戳  
 
### FPMM.sol
使用的自动做市商机制  
可调用函数（已测试）： 
 - ```withdrawFees(address account)```将部分交易费转给指定流动性提供者
 - ```withdrawMangerFee()```向合约所有人转入收取的协议费用，只能所有人调用
 - ```addFunding(uint addedFunds, uint[] calldata distributionHint)```提供流动性，第二个参数为初始化流动性所设定的初始价格
 - ```removeFunding(uint sharesToBurn)```移除流动性
 - ```buy(uint investmentAmount, uint outcomeIndex, uint minOutcomeTokensToBuy)```通过FPMM购买条件代币
 - ```sell(uint returnAmount, uint outcomeIndex, uint maxOutcomeTokensToSell)```通过FPMM出售条件代币  

 可调用函数（未测试）：
 - view函数
 - 部分所有人有关函数，比如所有人转移
 - ERC20相关函数如转账和授权
 - ```onERC1165Recieved()```一般只能在conditionalToken转账时使用
