"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raffleizeValidatorHash = void 0;
var lucid_cardano_fork_1 = require("@anastasia-labs/lucid-cardano-fork");
var raffleizevalidator_json_1 = require("../src/raffleizevalidator.json");
//lucid.selectWalletFromSeed("absorb another vanish tonight sight dove odor female isolate other proof length shover love crack plastic coffee ginger exploit rally acid vapor glance another");
//export const adminAddr = await lucid.wallet.address();
//console.log("Address", adminAddr);
var pubkeyhash = "a2c20c77887ace1cd986193e4e75babd8993cfd56995cd5cfce609c2";
console.log("Pub key hash", pubkeyhash);
exports.raffleizeValidatorHash = {
    type: "PlutusV2",
    script: (0, lucid_cardano_fork_1.applyParamsToScript)(raffleizevalidator_json_1.default.cborHex, [pubkeyhash]), // can use the .plutus file directly, no need to create raffle param
};
console.log("Raffle validator", exports.raffleizeValidatorHash);
