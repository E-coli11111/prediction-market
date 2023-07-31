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
exports.FPMM = void 0;
var contracts_1 = require("@ethersproject/contracts");
var abi_1 = require("@ethersproject/abi");
var FPMMJSON = require("../contracts/artifacts/FPMM_metadata.json");
var FPMM = /** @class */ (function () {
    function FPMM(signer, address) {
        this.address = address;
        this.signer = signer;
        this.contract = new contracts_1.Contract(address, FPMM.adapterAbi, this.signer);
    }
    FPMM.prototype.addFunding = function (addedFund, distributionHint, overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var txn, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(overrides != undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.contract.addFunding(addedFund, distributionHint, overrides)];
                    case 1:
                        txn = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.contract.initializeQuestion(addedFund, distributionHint)];
                    case 3:
                        txn = _a.sent();
                        _a.label = 4;
                    case 4:
                        console.log("Adding Liquidity");
                        console.log("Transaction hash: ".concat(txn.hash));
                        return [4 /*yield*/, txn.wait()];
                    case 5:
                        receipt = _a.sent();
                        console.log("Complete!");
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    FPMM.prototype.removeFunding = function (sharesToBurn, overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var txn, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(overrides != undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.contract.removeFunding(sharesToBurn, overrides)];
                    case 1:
                        txn = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.contract.removeFunding(sharesToBurn)];
                    case 3:
                        txn = _a.sent();
                        _a.label = 4;
                    case 4:
                        console.log("Removing Liquidity");
                        console.log("Transaction hash: ".concat(txn.hash));
                        return [4 /*yield*/, txn.wait()];
                    case 5:
                        receipt = _a.sent();
                        console.log("Complete!");
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    FPMM.prototype.Buy = function (investment, index, overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var txn, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(overrides != undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.contract.Buy(investment, index, 0, overrides)];
                    case 1:
                        txn = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.contract.Buy(investment, index, 0)];
                    case 3:
                        txn = _a.sent();
                        _a.label = 4;
                    case 4:
                        console.log("Buying outcome token:");
                        console.log("Transaction hash: ".concat(txn.hash));
                        return [4 /*yield*/, txn.wait()];
                    case 5:
                        receipt = _a.sent();
                        console.log("Complete!");
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    FPMM.prototype.Sell = function (receive, index, max, overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var txn, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(overrides != undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.contract.Buy(receive, index, max, overrides)];
                    case 1:
                        txn = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.contract.Buy(receive, index, max)];
                    case 3:
                        txn = _a.sent();
                        _a.label = 4;
                    case 4:
                        console.log("Selling outcome token");
                        console.log("Transaction hash: ".concat(txn.hash));
                        return [4 /*yield*/, txn.wait()];
                    case 5:
                        receipt = _a.sent();
                        console.log("Complete!");
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    FPMM.prototype.getLiquidity = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.getLiquidity()];
            });
        });
    };
    FPMM.prototype.getPoolBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.getPoolBalance()];
            });
        });
    };
    FPMM.adapterAbi = new abi_1.Interface(FPMMJSON.output.abi);
    return FPMM;
}());
exports.FPMM = FPMM;
