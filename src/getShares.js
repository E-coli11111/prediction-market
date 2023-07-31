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
var ethers_1 = require("ethers");
var abi_1 = require("@ethersproject/abi");
var fpmm_abi = require("../contracts/artifacts/FPMM_metadata.json");
var proxy_abi = require("../contracts/artifacts/FPMMProxy_metadata.json");
var proxy_addr = "0x36bede640D19981A82090519bC1626249984c908";
var fpmm_addr = "0x12ed368F440bB54D1dEcBf99C823276846944aE1";
var usr_addr = "0x974b1829D4EEEe518afeaB23f8a3d6c53A651cb3";
var getShares = function () { return __awaiter(void 0, void 0, void 0, function () {
    var provider, wallet, conditionalTokens, fpmm, conditionID, yes_collectionID, no_collectionID, yes_posID, no_posID, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                provider = ethers_1.ethers.getDefaultProvider('rinkeby');
                wallet = new ethers_1.ethers.Wallet("0a6f169bd2c0e260b8783634873cdd54d10df473bbd001530c926f9675724dfd", provider);
                conditionalTokens = new ethers_1.ethers.Contract(conditionalTokens_addr, new abi_1.Interface(conditionalTokens_abi), wallet);
                fpmm = new ethers_1.ethers.Contract(fpmm_addr, new abi_1.Interface(fpmm_abi.output.abi), wallet);
                return [4 /*yield*/, fpmm.conditionIds(0)];
            case 1:
                conditionID = _a.sent();
                console.log(conditionID);
                return [4 /*yield*/, conditionalTokens.getCollectionId("0x0000000000000000000000000000000000000000000000000000000000000000", conditionID, "1" //0b01
                    )];
            case 2:
                yes_collectionID = _a.sent();
                return [4 /*yield*/, conditionalTokens.getCollectionId("0x0000000000000000000000000000000000000000000000000000000000000000", conditionID, "2" //0b10
                    )];
            case 3:
                no_collectionID = _a.sent();
                return [4 /*yield*/, conditionalTokens.getPositionId(collateral_addr, yes_collectionID)];
            case 4:
                yes_posID = _a.sent();
                return [4 /*yield*/, conditionalTokens.getPositionId(collateral_addr, no_collectionID)];
            case 5:
                no_posID = _a.sent();
                return [4 /*yield*/, conditionalTokens.balanceOfBatch([fpmm_addr, fpmm_addr], [yes_posID, no_posID])];
            case 6:
                balance = _a.sent();
                console.log(parseInt(balance[0]._hex, 16));
                console.log(parseInt(balance[1]._hex, 16));
                console.log(balance[0].toString);
                return [2 /*return*/];
        }
    });
}); };
getShares();
