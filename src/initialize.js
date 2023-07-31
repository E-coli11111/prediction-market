"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.sleep = void 0;
var ethers_1 = require("ethers");
var contracts_1 = require("@ethersproject/contracts");
var abi_1 = require("@ethersproject/abi");
var Reporter_1 = require("./Reporter");
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
var provider = ethers_1.ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com/");
var reporter_addr = "0x31e25073D4376e2eAEe343c8A0A756573Fa38cfc";
var conditional_addr = "0x49fCBe66031171D8Ee2d656E39A4E1d146AE3D24";
var factory_addr = "0x0A5DAd97E0686A6d3568B2c447A0D022a80b6836";
var proxy_addr = "0xf6BC7c6013d680e22ed835A76F6313D24F6efd75";
var USDC_addr = "0x61b84D1DcD51C3661061d621Ee53F3Bd8fE710Ae";
var addr = "0x974b1829D4EEEe518afeaB23f8a3d6c53A651cb3";
var createWallet = function () {
    var provider = ethers_1.ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com/");
    return new ethers_1.ethers.Wallet("0a6f169bd2c0e260b8783634873cdd54d10df473bbd001530c926f9675724dfd", provider);
};
var cond_abi = require("./conditionalTokens_abi.json");
var factory_abi = require("../contracts/artifacts/FPMMFactory_metadata.json");
var proxy_abi = require("../contracts/artifacts/FPMMProxy_metadata.json");
var fpmm_abi = require("../contracts/artifacts/FPMM_metadata.json");
var usdc_abi = require("../contracts/artifacts/ToyToken_metadata.json");
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
// Parameters
var proxyActivate = true;
var closetime = 1692288000;
var sponserID = ethers_1.BigNumber.from("1");
var initialLiquidity = 100000;
var questionTitle = "6.0%+"; //question short
var questionDes = "China's GDP growth in 2023"; //question long
var fee = "1000000000000"; //10^18 = 100%
var initialize = function (gasPrice) { return __awaiter(void 0, void 0, void 0, function () {
    var nonce, reporter, questionID1, questionID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("-------------");
                return [4 /*yield*/, provider.getTransactionCount(addr)];
            case 1:
                nonce = _a.sent();
                reporter = new Reporter_1.Reporter(createWallet(), reporter_addr);
                questionID1 = ethers_1.ethers.utils.id("q: title: ".concat(questionTitle, ", description: ").concat(questionDes, ", res_data: ").concat("Yes", " = 0, ").concat("No", " = 1, unknown = 1000, source = ").concat("https://www.bls.gov/"));
                console.log(questionID1);
                return [4 /*yield*/, reporter.initializeAndPrepare(questionTitle, questionDes, ["Yes", "No"], "https://www.bls.gov/", closetime, { "gasPrice": gasPrice, "nonce": nonce })];
            case 2:
                questionID = _a.sent();
                // console.log(receipt);
                return [2 /*return*/, questionID];
        }
    });
}); };
var createFPMM = function (conditionID) { return __awaiter(void 0, void 0, void 0, function () {
    var nonce, gasPrice, factory, txn, receipt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("-------------");
                return [4 /*yield*/, provider.getTransactionCount(addr)];
            case 1:
                nonce = _a.sent();
                return [4 /*yield*/, provider.getGasPrice()];
            case 2:
                gasPrice = _a.sent();
                factory = new contracts_1.Contract(factory_addr, new abi_1.Interface(factory_abi.output.abi), createWallet());
                return [4 /*yield*/, factory.createFixedProductMarketMaker(conditional_addr, USDC_addr, [conditionID], ethers_1.BigNumber.from(fee), 0, closetime, { "gasPrice": gasPrice, "nonce": nonce })];
            case 3:
                txn = _a.sent();
                console.log("Creating FPMM...");
                console.log("Transaction hash: ".concat(txn.hash));
                console.log(txn.nonce);
                return [4 /*yield*/, txn.wait()];
            case 4:
                receipt = _a.sent();
                console.log(receipt.logs[0].address);
                console.log("FPMM Created!");
                console.log("FPMM Address: ".concat(receipt.logs[0].address));
                return [2 /*return*/, receipt.logs[0].address];
        }
    });
}); };
var registerResult = function (fpmm) { return __awaiter(void 0, void 0, void 0, function () {
    var txn, nonce, gasPrice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, provider.getTransactionCount(addr)];
            case 1:
                nonce = _a.sent();
                console.log(nonce);
                console.log("-------------");
                return [4 /*yield*/, provider.getGasPrice()];
            case 2:
                gasPrice = _a.sent();
                console.log("Registering first outcome to FPMM...");
                return [4 /*yield*/, fpmm.registerResult("Yes", 1, { "gasPrice": gasPrice, "nonce": nonce })];
            case 3:
                txn = _a.sent();
                console.log("Transaction hash: ".concat(txn.hash));
                console.log(txn.nonce);
                return [4 /*yield*/, txn.wait()];
            case 4:
                _a.sent();
                console.log("First outcome registered");
                return [4 /*yield*/, (0, exports.sleep)(30000)];
            case 5:
                _a.sent();
                console.log("Registering second outcome to FPMM...");
                return [4 /*yield*/, fpmm.registerResult("No", 2, { "gasPrice": gasPrice, "nonce": nonce + 1 })];
            case 6:
                txn = _a.sent();
                console.log("Transaction hash: ".concat(txn.hash));
                console.log(txn.nonce);
                return [4 /*yield*/, txn.wait()];
            case 7:
                _a.sent();
                console.log("Second outcome registered");
                return [2 /*return*/];
        }
    });
}); };
var registerProxy = function (fpmm_addr, sponserID) { return __awaiter(void 0, void 0, void 0, function () {
    var nonce, gasPrice, proxy, txn, temp, deadline, txn_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("-------------");
                return [4 /*yield*/, provider.getTransactionCount(addr)];
            case 1:
                nonce = _a.sent();
                return [4 /*yield*/, provider.getGasPrice()];
            case 2:
                gasPrice = _a.sent();
                proxy = new contracts_1.Contract(proxy_addr, new abi_1.Interface(proxy_abi.output.abi), createWallet());
                console.log("Registering FPMM to Proxy...");
                return [4 /*yield*/, proxy.registerFPMM(sponserID, fpmm_addr, { "gasPrice": gasPrice, "nonce": nonce })];
            case 3:
                txn = _a.sent();
                console.log("Transaction hash: ".concat(txn.hash));
                console.log(txn.nonce);
                return [4 /*yield*/, txn.wait()];
            case 4:
                _a.sent();
                console.log("FPMM Registered!");
                return [4 /*yield*/, proxy.deadlines(sponserID)];
            case 5:
                temp = _a.sent();
                deadline = parseInt(temp._hex, 16);
                console.log(deadline);
                if (!(deadline < closetime)) return [3 /*break*/, 8];
                console.log("Sponser token deadline ".concat(deadline, " is too close"));
                console.log("Updating deadline...");
                return [4 /*yield*/, proxy.setDeadline(sponserID, closetime, { "gasPrice": gasPrice, "nonce": nonce + 1 })];
            case 6:
                txn_1 = _a.sent();
                console.log("Transaction hash: ".concat(txn_1.hash));
                console.log(txn_1.nonce);
                return [4 /*yield*/, txn_1.wait()];
            case 7:
                _a.sent();
                console.log("Deadline Updated!");
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
var initLiquidity = function (fpmm) { return __awaiter(void 0, void 0, void 0, function () {
    var usdc, gasPrice, nonce, txn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("-------------");
                usdc = new contracts_1.Contract(USDC_addr, new abi_1.Interface(usdc_abi.output.abi), createWallet());
                return [4 /*yield*/, provider.getGasPrice()];
            case 1:
                gasPrice = _a.sent();
                return [4 /*yield*/, provider.getTransactionCount(addr)];
            case 2:
                nonce = _a.sent();
                console.log("Approving USDC...");
                return [4 /*yield*/, usdc.approve(fpmm.address, initialLiquidity, { "gasPrice": gasPrice, "nonce": nonce })];
            case 3:
                txn = _a.sent();
                console.log("Transaction hash: ".concat(txn.hash));
                console.log(txn.nonce);
                return [4 /*yield*/, txn.wait()];
            case 4:
                _a.sent();
                console.log("USDC Approved!");
                console.log("-------------");
                console.log("Adding Liquidity...");
                return [4 /*yield*/, fpmm.addFunding(initialLiquidity, [], { "gasPrice": gasPrice, "nonce": nonce + 1 })];
            case 5:
                txn = _a.sent();
                console.log("Transaction hash: ".concat(txn.hash));
                console.log(txn.nonce);
                return [4 /*yield*/, txn.wait()];
            case 6:
                _a.sent();
                console.log("Liquidity Initialized!");
                return [2 /*return*/];
        }
    });
}); };
var getConditionID = function (questionID) { return __awaiter(void 0, void 0, void 0, function () {
    var conditionalToken, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                conditionalToken = new contracts_1.Contract(conditional_addr, new abi_1.Interface(cond_abi), createWallet());
                return [4 /*yield*/, conditionalToken.getConditionId(reporter_addr, questionID, 2)];
            case 1:
                result = _a.sent();
                console.log("-------------");
                console.log("Condition ID: ".concat(result));
                return [2 /*return*/, result];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var gasPrice, questionID, conditionID, fpmm_addr, fpmm, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 13, , 14]);
                return [4 /*yield*/, provider.getGasPrice()];
            case 1:
                gasPrice = _a.sent();
                return [4 /*yield*/, initialize(gasPrice)];
            case 2:
                questionID = _a.sent();
                return [4 /*yield*/, getConditionID(questionID)];
            case 3:
                conditionID = _a.sent();
                return [4 /*yield*/, (0, exports.sleep)(30000)];
            case 4:
                _a.sent();
                return [4 /*yield*/, createFPMM(conditionID)];
            case 5:
                fpmm_addr = _a.sent();
                fpmm = new contracts_1.Contract(fpmm_addr, new abi_1.Interface(fpmm_abi.output.abi), createWallet());
                return [4 /*yield*/, (0, exports.sleep)(30000)];
            case 6:
                _a.sent();
                return [4 /*yield*/, registerResult(fpmm)];
            case 7:
                _a.sent();
                if (!proxyActivate) return [3 /*break*/, 10];
                return [4 /*yield*/, (0, exports.sleep)(30000)];
            case 8:
                _a.sent();
                return [4 /*yield*/, registerProxy(fpmm_addr, sponserID)];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10: return [4 /*yield*/, (0, exports.sleep)(30000)];
            case 11:
                _a.sent();
                return [4 /*yield*/, initLiquidity(fpmm)];
            case 12:
                _a.sent();
                console.log("-------------");
                return [3 /*break*/, 14];
            case 13:
                e_1 = _a.sent();
                console.log(e_1.message);
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
main();
// 0x144744da0D2dB0F5788D836527181Fcc2F35723C    0x856eecbab409c3582b14130410077f16fb151516fc69967368700800b504ba4c
