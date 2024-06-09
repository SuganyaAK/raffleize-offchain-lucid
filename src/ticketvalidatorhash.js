"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketValidatorHash = void 0;
var lucid_cardano_fork_1 = require("@anastasia-labs/lucid-cardano-fork");
var ticketvalidator_json_1 = require("../src/ticketvalidator.json");
var pubkeyhash = "a2c20c77887ace1cd986193e4e75babd8993cfd56995cd5cfce609c2";
exports.ticketValidatorHash = {
    type: "PlutusV2",
    script: (0, lucid_cardano_fork_1.applyParamsToScript)(ticketvalidator_json_1.default.cborHex, [lucid_cardano_fork_1.Data.to(pubkeyhash)]), // can use the .plutus file directly, no need to create raffle param
};
