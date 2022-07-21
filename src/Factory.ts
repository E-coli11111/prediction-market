import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Interface } from "@ethersproject/abi";

const FactoryJSON = require("../contracts/artifacts/FPMMFactory_metadata.json");

export class Reporter {

    public static adapterAbi: Interface = new Interface(FactoryJSON.output.abi);

    readonly contract: Contract
    readonly address: string;
    readonly signer: JsonRpcSigner | Wallet;

    constructor(signer: JsonRpcSigner | Wallet, address: string) {
        this.address = address;
        this.signer = signer;
        this.contract = new Contract(address, Reporter.adapterAbi, this.signer);
    }

    public async createFixedProductMarketMaker(
        conditionalTokens: string,
        collateralToken: string,
        conditionIds: string[],
        fee: BigNumber,
        managerFee: BigNumber,
        closeTime: BigNumber,
        overrides: ethers.Overrides
    ): Promise<TransactionReceipt> {
        let txn: TransactionResponse;
        if (overrides != undefined) {
            txn = await this.contract.createFixedProductMarketMaker(
                conditionalTokens,
                collateralToken,
                conditionIds,
                fee,
                managerFee,
                closeTime,
                overrides,
            );
        } else {
            txn = await this.contract.createFixedProductMarketMaker(
                conditionalTokens,
                collateralToken,
                conditionIds,
                fee,
                managerFee,
                closeTime,
            );
        }

        console.log(`Creating FPMM: ${conditionIds}...`);
        console.log(`Transaction hash: ${txn.hash}`);
        const receipt: TransactionReceipt = await txn.wait();
        console.log(`FPMM Created!`);
        return receipt;
    }
}
