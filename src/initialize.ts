import { BigNumber, Wallet, ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
import { Reporter } from "./Reporter";



// Polygon

// const provider = ethers.getDefaultProvider("https://polygon-rpc.com");
// const reporter_addr = "0xf0d0e499F28771878eBdDFA280A4d3008E95D104";
// const conditional_addr = "0x20C31139dFfF342f2Bc37201D68E362ee3c1eE9A";
// const factory_addr = "0xBaD769bBc8ec4Eb194244324F5C603C4b8fbD672";
// const proxy_addr = "0xF0Ab091ba6837839698D94105a38526F9e09F996";
// const USDC_addr = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
// let addr = "0x656397a6625F0C8b02fD751f407c72A1e1089810";

// const createWallet = ():Wallet => {
//     const provider = ethers.getDefaultProvider("https://polygon-rpc.com");
//     return new ethers.Wallet("4b3b7b6b04bdcd985cf218e1efdd8ccfd178fce90bd08a3e7bdcbcb1e5924124", provider);
// }


// Mumbai

const provider = ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com/");
const reporter_addr = "0x31e25073D4376e2eAEe343c8A0A756573Fa38cfc";
const conditional_addr = "0x49fCBe66031171D8Ee2d656E39A4E1d146AE3D24";
const factory_addr = "0x0A5DAd97E0686A6d3568B2c447A0D022a80b6836";
const proxy_addr = "0xf6BC7c6013d680e22ed835A76F6313D24F6efd75";
const USDC_addr = "0x61b84D1DcD51C3661061d621Ee53F3Bd8fE710Ae";
let addr = "0x974b1829D4EEEe518afeaB23f8a3d6c53A651cb3";

const createWallet = ():Wallet => {
    const provider = ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com/");
    return new ethers.Wallet("0a6f169bd2c0e260b8783634873cdd54d10df473bbd001530c926f9675724dfd", provider);
}

const cond_abi = require("./conditionalTokens_abi.json");
const factory_abi = require("../contracts/artifacts/FPMMFactory_metadata.json");
const proxy_abi = require("../contracts/artifacts/FPMMProxy_metadata.json");
const fpmm_abi = require("../contracts/artifacts/FPMM_metadata.json");
const usdc_abi = require("../contracts/artifacts/ToyToken_metadata.json");


export const sleep = (ms) => {
    return new Promise(resolve=>setTimeout(resolve, ms))
}

// Parameters
const proxyActivate = true;
const closetime = 1692288000;
const sponserID = BigNumber.from("1");
const initialLiquidity = 100000;
const questionTitle = "6.0%+";//question short
const questionDes = "China's GDP growth in 2023";//question long
const fee = "1000000000000";//10^18 = 100%



const initialize = async(gasPrice: BigNumber):Promise<string> =>{
    console.log("-------------");
    let nonce = await provider.getTransactionCount(addr);
    const reporter = new Reporter(createWallet(), reporter_addr);
    const questionID1 = ethers.utils.id(`q: title: ${questionTitle}, description: ${questionDes}, res_data: ${"Yes"} = 0, ${"No"} = 1, unknown = 1000, source = ${"https://www.bls.gov/"}`);
    console.log(questionID1);
    const questionID = await reporter.initializeAndPrepare(
        questionTitle,
        questionDes,
        ["Yes", "No"],
        "https://www.bls.gov/",
        closetime,
        {"gasPrice": gasPrice, "nonce": nonce});
    // console.log(receipt);
    return questionID;
}

const createFPMM = async(conditionID: string):Promise<string> => {
    console.log("-------------");
    let nonce = await provider.getTransactionCount(addr);
    let gasPrice = await provider.getGasPrice();
    let factory = new Contract(factory_addr, new Interface(factory_abi.output.abi), createWallet());
    let txn = await factory.createFixedProductMarketMaker(conditional_addr, USDC_addr, [conditionID], BigNumber.from(fee), 0, closetime,{"gasPrice":gasPrice, "nonce":nonce});
    console.log("Creating FPMM...");
    console.log(`Transaction hash: ${txn.hash}`);
    console.log(txn.nonce);
    const receipt = await txn.wait();
    console.log(receipt.logs[0].address);
    console.log("FPMM Created!");
    console.log(`FPMM Address: ${receipt.logs[0].address}`);
    return receipt.logs[0].address;
}

const registerResult = async(fpmm: Contract) => {
    let txn;
    let nonce = await provider.getTransactionCount(addr);
    console.log(nonce)
    console.log("-------------");
    let gasPrice = await provider.getGasPrice();
    console.log("Registering first outcome to FPMM...");
    txn = await fpmm.registerResult("Yes", 1, {"gasPrice":gasPrice, "nonce":nonce});
    console.log(`Transaction hash: ${txn.hash}`);
    console.log(txn.nonce);
    await txn.wait();
    console.log("First outcome registered");
    await sleep(30000);
    console.log("Registering second outcome to FPMM...");
    txn = await fpmm.registerResult("No", 2, {"gasPrice":gasPrice, "nonce":nonce + 1});
    console.log(`Transaction hash: ${txn.hash}`);
    console.log(txn.nonce);
    await txn.wait()
    console.log("Second outcome registered");
}

const registerProxy = async(fpmm_addr: string, sponserID: BigNumber) => {
    console.log("-------------");
    let nonce = await provider.getTransactionCount(addr);
    let gasPrice = await provider.getGasPrice();
    let proxy = new Contract(proxy_addr, new Interface(proxy_abi.output.abi), createWallet());
    console.log("Registering FPMM to Proxy...");
    let txn = await proxy.registerFPMM(sponserID, fpmm_addr, {"gasPrice":gasPrice, "nonce":nonce});
    console.log(`Transaction hash: ${txn.hash}`);
    console.log(txn.nonce);
    await txn.wait();
    console.log("FPMM Registered!");
    let temp = await proxy.deadlines(sponserID);
    const deadline = parseInt(temp._hex, 16);
    console.log(deadline);
    if(deadline < closetime){
        console.log(`Sponser token deadline ${deadline} is too close`);
        console.log("Updating deadline...");
        let txn = await proxy.setDeadline(sponserID, closetime, {"gasPrice":gasPrice, "nonce":nonce + 1});
        console.log(`Transaction hash: ${txn.hash}`);
        console.log(txn.nonce);
        await txn.wait()
        console.log("Deadline Updated!");
    }
}

const initLiquidity = async(fpmm: Contract) =>{
    console.log("-------------");
    let usdc = new Contract(USDC_addr, new Interface(usdc_abi.output.abi), createWallet());
    let gasPrice = await provider.getGasPrice();
    let nonce = await provider.getTransactionCount(addr);
    console.log("Approving USDC...");
    let txn = await usdc.approve(fpmm.address, initialLiquidity, {"gasPrice":gasPrice, "nonce":nonce});
    console.log(`Transaction hash: ${txn.hash}`);
    console.log(txn.nonce);
    await txn.wait()
    console.log("USDC Approved!");
    console.log("-------------");
    console.log("Adding Liquidity...");
    txn = await fpmm.addFunding(initialLiquidity, [], {"gasPrice":gasPrice, "nonce":nonce + 1});
    console.log(`Transaction hash: ${txn.hash}`);
    console.log(txn.nonce);
    await txn.wait()
    console.log("Liquidity Initialized!");
}

const getConditionID = async(questionID: string): Promise<string> => {
    let conditionalToken = new Contract(conditional_addr, new Interface(cond_abi), createWallet());
    const result = await conditionalToken.getConditionId(reporter_addr, questionID, 2);
    console.log("-------------");
    console.log(`Condition ID: ${result}`);
    return result;
}

const main = async () => {
    // console.log(await wallet.getAddress())
    try{
        let gasPrice = await provider.getGasPrice();
        const questionID = await initialize(gasPrice);
        const conditionID = await getConditionID(questionID);
        await sleep(30000);
        // const conditionID = "0xc51d827527188af1ac56627ef2882f8fd64390c07c291fe4972fb814443f5f75";
        const fpmm_addr = await createFPMM(conditionID);
        // const fpmm_addr = "0x7947d19c54b75Dce91Fe1bAf9DAAC53f33C55fc8";
        const fpmm = new Contract(fpmm_addr, new Interface(fpmm_abi.output.abi), createWallet());
        await sleep(30000);
        await registerResult(fpmm);
        
        if(proxyActivate){
            await sleep(30000);
            await registerProxy(fpmm_addr, sponserID);
        }
        await sleep(30000);
        await initLiquidity(fpmm);
        console.log("-------------");
    }catch(e){
        console.log(e.message);
    }
    
}
main();


// 0x144744da0D2dB0F5788D836527181Fcc2F35723C    0x856eecbab409c3582b14130410077f16fb151516fc69967368700800b504ba4c