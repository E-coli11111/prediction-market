import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Interface } from "@ethersproject/abi";
import { exec } from "child_process";
import { promisify } from "util";

const ReporterJSON = require("../contracts/artifacts/Reporter_metadata.json");

export interface QuestionData {
    result: number;
    resolutionTime: BigNumber;
    settled: BigNumber;
    resolved: boolean;
    ancillaryData: string;
}

export class Reporter {

    public static adapterAbi: Interface = new Interface(ReporterJSON.output.abi);

    readonly contract: Contract
    readonly address: string;
    readonly signer: JsonRpcSigner | Wallet;

    constructor(signer: JsonRpcSigner | Wallet, address: string) {
        this.address = address;
        this.signer = signer;
        this.contract = new Contract(address, Reporter.adapterAbi, this.signer);
    }


    public async initializeQuestion(
            title: string,
            description: string,
            outcomes: string[],
            series: string,
            solveTime: number,
            overrides?: ethers.Overrides,
        ): Promise<TransactionReceipt> {
        if (outcomes.length != 2) {
            throw new Error("Invalid outcome length! Must be 2!");
        }
        // Dynamically generate ancillary data with binary resolution data appended
        const ancillaryData = this.createAncillaryData(title, description, outcomes, series, solveTime);
        const questionID = ethers.utils.formatBytes32String(`q: title: ${title}, description: ${description}, res_data: ${outcomes[0]} = 0, ${outcomes[1]} = 1, unknown = 1000, series = ${series}`);
        let txn: TransactionResponse;
        if (overrides != undefined) {
            txn = await this.contract.initializeQuestion(
                questionID,
                ancillaryData,
                solveTime - 3600,
                overrides,
            );
        } else {
            txn = await this.contract.initializeQuestion(
                questionID,
                ancillaryData,
                solveTime - 3600,
            );
        }

        console.log(`Initializing questionID: ${questionID}...`);
        console.log(`Transaction hash: ${txn.hash}`);
        const receipt: TransactionReceipt = await txn.wait();
        console.log(`Question initialized!`);
        return receipt;
    }

    public async prepareCondition(questionID: string, overrides?: ethers.Overrides): Promise<TransactionReceipt>{
        let txn: TransactionResponse;
        if(overrides == undefined)
            txn = await this.contract.prepareCondition(questionID, 2);
        else
            txn = await this.contract.prepareCondition(questionID, 2, overrides);

        console.log(`Preparing question: ${questionID}...`);
        console.log(`Transaction hash: ${txn.hash}`);
        const receipt: TransactionReceipt = await txn.wait();
        console.log(`Condition prepared!`);
        return receipt;
    }

    public async settle(questionID: string, price: number, overrides?: ethers.Overrides): Promise<TransactionReceipt>{
        let txn: TransactionResponse;
        if(overrides == undefined)
            txn = await this.contract.settleQuestion(questionID);
        else
            txn = await this.contract.settleQuestion(questionID, overrides);

        console.log(`Settling question: ${questionID}...`);
        console.log(`Transaction hash: ${txn.hash}`);
        const receipt: TransactionReceipt = await txn.wait();
        console.log(`Question settled!`);
        return receipt;
    }

    /**
     * Creates the ancillary data used to resolve questions
     * Appends resolution request information
     *
     * @param title
     * @param description
     * @param outcomes
     * @returns
     */
    public createAncillaryData = (title: string, description: string, outcomes: string[], series: string, solveTime: number): Uint8Array => {
        return ethers.utils.toUtf8Bytes(`q: title: ${title}, description: ${description}, res_data: ${outcomes[0]} = 0, ${outcomes[1]} = 1, unknown = 1000, series = ${series}`);
    }

    private async getData(args){
        const exec1 = promisify(exec);
        const { stdout, stderr } = await exec1("python getData.py " + args);
        console.log(stdout);
        return stdout;
    }
}
    

