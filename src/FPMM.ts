import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Interface } from "@ethersproject/abi";
import { exec } from "child_process";
import { promisify } from "util";

const FPMMJSON = require("../contracts/artifacts/FPMM_metadata.json");


export class FPMM {

    public static adapterAbi: Interface = new Interface(FPMMJSON.output.abi);

    readonly contract: Contract
    readonly address: string;
    readonly signer: JsonRpcSigner | Wallet;

    constructor(signer: JsonRpcSigner | Wallet, address: string) {
        this.address = address;
        this.signer = signer;
        this.contract = new Contract(address, FPMM.adapterAbi, this.signer);
    }


    public async addFunding(
        addedFund: number,
        distributionHint: number[],
        overrides?: ethers.Overrides,
    ): Promise<TransactionReceipt> {
        let txn: TransactionResponse;
        if (overrides != undefined) {
            txn = await this.contract.addFunding(
                addedFund,
                distributionHint,
                overrides,
            );
        } else {
            txn = await this.contract.initializeQuestion(
                addedFund,
                distributionHint,
            );
        }

        console.log(`Adding Liquidity`);
        console.log(`Transaction hash: ${txn.hash}`);
        const receipt: TransactionReceipt = await txn.wait();
        console.log(`Complete!`);
        return receipt;
    }

    public async removeFunding(
        sharesToBurn: number,
        overrides?: ethers.Overrides,
    ): Promise<TransactionReceipt> {
        let txn: TransactionResponse;
        if (overrides != undefined) {
            txn = await this.contract.removeFunding(
                sharesToBurn,
                overrides,
            );
        } else {
            txn = await this.contract.removeFunding(
                sharesToBurn,
            );
        }

        console.log(`Removing Liquidity`);
        console.log(`Transaction hash: ${txn.hash}`);
        const receipt: TransactionReceipt = await txn.wait();
        console.log(`Complete!`);
        return receipt;
    }

    public async Buy(
        investment: number,
        index: number,
        overrides?: ethers.Overrides,
    ): Promise<TransactionReceipt> {
        let txn: TransactionResponse;
        if (overrides != undefined) {
            txn = await this.contract.Buy(
                investment,
                index,
                0,
                overrides,
            );
        } else {
            txn = await this.contract.Buy(
                investment,
                index,
                0,
            );
        }

        console.log(`Buying outcome token:`);
        console.log(`Transaction hash: ${txn.hash}`);
        const receipt: TransactionReceipt = await txn.wait();
        console.log(`Complete!`);
        return receipt;
    }

    public async Sell(
        receive: number,
        index: number,
        max: number,
        overrides?: ethers.Overrides,
    ): Promise<TransactionReceipt> {
        let txn: TransactionResponse;
        if (overrides != undefined) {
            txn = await this.contract.Buy(
                receive,
                index,
                max,
                overrides,
            );
        } else {
            txn = await this.contract.Buy(
                receive,
                index,
                max,
            );
        }

        console.log(`Selling outcome token`);
        console.log(`Transaction hash: ${txn.hash}`);
        const receipt: TransactionReceipt = await txn.wait();
        console.log(`Complete!`);
        return receipt;
    }

    public async getLiquidity(): number{
        return this.contract.getLiquidity();
    }

    public async getPoolBalance(): number[]{
        return this.contract.getPoolBalance();
    }
}


