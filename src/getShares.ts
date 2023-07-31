import { ethers } from "ethers";
import { Interface } from "@ethersproject/abi";

const fpmm_abi = require("../contracts/artifacts/FPMM_metadata.json");
const proxy_abi = require("../contracts/artifacts/FPMMProxy_metadata.json");


const proxy_addr = "0x36bede640D19981A82090519bC1626249984c908";
const fpmm_addr = "0x12ed368F440bB54D1dEcBf99C823276846944aE1";
const usr_addr = "0x974b1829D4EEEe518afeaB23f8a3d6c53A651cb3";

const getShares = async() =>{
    // const provider = ethers.provider.web3Provider(window.ethereum);

    // const fpmm = new ethers.Contract(fpmm_addr, fpmm_abi, provider)
    // const conditionalTokens = new ethers.Contract(conditionalTokens_addr, conditionalTokens_abi, provider);

    const provider = ethers.getDefaultProvider('rinkeby');
    const wallet = new ethers.Wallet("0a6f169bd2c0e260b8783634873cdd54d10df473bbd001530c926f9675724dfd", provider);//私钥
    const conditionalTokens = new ethers.Contract(conditionalTokens_addr,new Interface(conditionalTokens_abi), wallet);//地址
    const fpmm = new ethers.Contract(fpmm_addr,new Interface(fpmm_abi.output.abi), wallet)

    const conditionID = await fpmm.conditionIds(0);

    console.log(conditionID);

    const yes_collectionID = await conditionalTokens.getCollectionId(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        conditionID,
        "1" //0b01
    )
    const no_collectionID = await conditionalTokens.getCollectionId(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        conditionID,
        "2" //0b10
    )

    const yes_posID = await conditionalTokens.getPositionId(collateral_addr, yes_collectionID);
    const no_posID = await conditionalTokens.getPositionId(collateral_addr, no_collectionID);

    const balance = await conditionalTokens.balanceOfBatch([fpmm_addr, fpmm_addr], [yes_posID, no_posID]);
    console.log(parseInt(balance[0]._hex, 16));
    console.log(parseInt(balance[1]._hex, 16));
    console.log(balance[0].toString)
}

getShares();
