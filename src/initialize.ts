import { Reporter } from "./Reporter";
import { Wallet } from "@ethersproject/wallet";
import { ethers } from "ethers";

const main = async() => {
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = new Wallet("af7244b81759754543948795c5da7775c0b6571991df3aacd00923c25991f6c1", provider);
    const reporter = new Reporter(signer, "0xC6B271c306e0a570d69f21F56362a58EC3742c43");
    console.log(signer);
    let result = await reporter.initializeQuestion("0x1234123412341234123412341234123412341234123412341234123412341234",
        "Hello!",
        "None",
        ["yes", "no"],
        "CUUR0000AA0",
        2000000000,
        { gasPrice: ethers.utils.parseUnits("100", 9) });
    console.log("test3");
    console.log(result);
};

main();
