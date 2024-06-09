"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var lucid_cardano_fork_1 = require("@anastasia-labs/lucid-cardano-fork");
var raffleizemintingpolicy_json_1 = require("../src/raffleizemintingpolicy.json");
var mintorganiserstake_js_1 = require("../src/mintorganiserstake.js");
var Utils_js_1 = require("./Utils.js");
var constants_js_1 = require("./common/constants.js");
var blakejs_1 = require("blakejs");
var rafflevalidatorhash_js_1 = require("../src/rafflevalidatorhash.js");
/*onst raffleparam : RaffleParam = {rMaxNoOfTickets : 20n
  , rMinRevealingWindow : 60_000n
  , rMinTicketPrice :2_000_000n
  , rRaffleValidatorHash : {getScriptHash : ""}
  , rTicketValidatorHash : {getScriptHash : ""}
  , rTicketCollateral :2_000_000n
  , rRaffleCollateral :2_000_000n};

console.log("Raffle parameters", raffleparam); // raffle param is parameterized
*/
var raffleizemintingpolicyScript = {
    type: "PlutusV2",
    script: raffleizemintingpolicy_json_1.default.cborHex //applyParamsToScript(script.cborHex,[Data.to(raffleparam,RaffleParam)]), // can use the .plutus file directly, no need to create raffle param
};
var raffleizemintingpolicyvaladdr = mintorganiserstake_js_1.lucid.utils.validatorToAddress(raffleizemintingpolicyScript);
console.log("Raffle minting policy address", raffleizemintingpolicyvaladdr);
console.log("Utxos at organiser address", await mintorganiserstake_js_1.lucid.utxosAt(mintorganiserstake_js_1.userAddr));
var userUtxos = await mintorganiserstake_js_1.lucid.utxosAt(mintorganiserstake_js_1.userAddr);
var selectedUtxo = (0, Utils_js_1.getUtxoWithAssets)(userUtxos, (_a = {}, _a["dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d746573747374616b6576616c7565"] = 1n, _a));
// use this selected utxo to create the hash 
console.log("Selected UTXO", selectedUtxo);
var collateral = (0, Utils_js_1.getUtxoWithAssets)(userUtxos, (_b = {}, _b["lovelace"] = 10000000n, _b));
var txHash = selectedUtxo.txHash;
var txHash256 = (0, blakejs_1.blake2b)((0, lucid_cardano_fork_1.fromHex)(txHash));
var outputIndex = selectedUtxo.outputIndex;
console.log("TxHash", txHash);
console.log("TxHash", outputIndex);
var outputIndexByte = new Uint8Array([outputIndex]);
var tokenName = (0, lucid_cardano_fork_1.toHex)(outputIndexByte) + (0, lucid_cardano_fork_1.toHex)((txHash256.slice(0, 27)));
//const tokenName = fromHex(tokenNameBytes);
console.log("Token name", tokenName);
var policyId = mintorganiserstake_js_1.lucid.utils.mintingPolicyToId(raffleizemintingpolicyScript);
var refNFT = (0, lucid_cardano_fork_1.toUnit)(policyId, tokenName, // hash of the utxoref which is used as the stake (input) , similar to seedTxOutRef
constants_js_1.REFERENCE_TOKEN_LABEL);
var userNFT = (0, lucid_cardano_fork_1.toUnit)(policyId, tokenName, constants_js_1.NON_FUNGIBLE_TOKEN_LABEL // 1. to get the txouterf, 2. hash ,3. crete  a tokenname with that hash
);
console.log("Asset Unit", userNFT);
console.log("Asset Unit", refNFT);
var rafconfig1 = {
    rCommitDDL: { getPOSIXTime: 1815741774000n },
    rRevealDDL: { getPOSIXTime: 1925631774000n },
    rTicketPrice: 5000000n,
    rMinTickets: 5n,
    rStake: new Map([[{ unCurrencySymbol: (0, lucid_cardano_fork_1.fromText)("dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d") },
            new Map([[{ unTokenName: (0, lucid_cardano_fork_1.fromText)("teststakevalue") }, 1n]])]]) // new Map([[{uncurrencusymbol: } ,new Map([[{untokenname : "" },1n]])]])
};
console.log("Raffle configuration", rafconfig1);
var txoutref = {
    txOutRefId: { Inline: selectedUtxo.txHash },
    txOutRefIdx: BigInt(outputIndex)
};
var redeemer = lucid_cardano_fork_1.Data.to({ MintRaffle: { x: rafconfig1, y: txoutref } }, Utils_js_1.Redeemer);
console.log("Mint Raffle Redeemer:", redeemer);
var datumStateData = {
    rRaffleID: { unAssetClass: { unCurrencySymbol: policyId, //"dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d",
            unTokenName: tokenName } } //fromText("teststakevalue")}} // not the stake , rafflemintingpolicyscript is the uncucrrencysymbol
    // tokenname : refnft and usernft's token name
    ,
    rParam: { rMaxNoOfTickets: 20n,
        rMinRevealingWindow: 6000n,
        rMinTicketPrice: 3000000n,
        rRaffleValidatorHash: { inline: rafflevalidatorhash_js_1.raffleizeValidatorHash.script },
        rTicketValidatorHash: { inline: "" } // ticketValidatorHash.script}
        ,
        rTicketCollateral: 3000000n,
        rRaffleCollateral: 3000000n }
    /*    { rMaxNoOfTickets = 20
, rMinRevealingWindow = 6_000 --- ^ Miliseconds
, rMinTicketPrice = 3_000_000 --- ^ Lovelaces
, rRaffleValidatorHash = raffleizeValidatorHashPlutus
, rTicketValidatorHash = ticketValidatorHashPlutus
, rTicketCollateral = 3_000_000 --- ^ Lovelaces
, rRaffleCollateral = 3_000_000 --- ^ Lovelaces
} */
    ,
    rConfig: rafconfig1,
    rSoldTickets: 0n,
    rRevealedTickets: 0n,
    rRefundedTickets: 0n,
    rRandomSeed: 0n
};
console.log("Raffle state data", datumStateData);
var raffledatum = {
    metadata: new Map([["description", constants_js_1.raffleDescription],
        ["image", constants_js_1.raffleImageURI],
        ["name", constants_js_1.raffleName]]),
    version: 1n,
    extra: datumStateData
};
//const metadatum = Data.to(raffledatum,RaffleDatum);
console.log("RaffleDatum", raffledatum);
/*
const tx = await lucid
  .newTx()
  .collectFrom([selectedUtxo])  // utxo with raffle stake
  .collectFrom([collateral]) // utxo with lovelace = 10_000_000n
  .mintAssets({[userNFT]: 1n, [refNFT]: 1n }, redeemer) // minting user NFT and ref NFT
  .attachMintingPolicy(raffleizemintingpolicyScript)
  .payToAddress(userAddr, { [userNFT]: 1n })
  .payToContract(raffleizemintingpolicyvaladdr, { inline: metadatum }, {
    [refNFT]: 1n,
  })
  //.addSigner(issuerAddr)
  .addSigner(userAddr)
  .complete();

  console.log("txoutput", tx);


/*   const tx = await lucid
  .newTx()
  .collectFrom([selectedUtxo])
  .mintAssets({ [userNFT]: 1n, [refNFT]: 1n }, mintRdmr)
  .attachMintingPolicy(mintValidator.validator)
  .payToAddress(userAddr, { [userNFT]: 1n })
  .payToContract(storeValidator.lockAddress, { inline: metadatum }, {
    [refNFT]: 1n,
  })
  .addSigner(issuerAddr)
  .addSigner(userAddr)
  .validFrom(Date.now() - 60 * 1000) // Substracting 1 minute to offset diff (blockfrost server time - local system time)
  .validTo(Date.now() + 15 * 60 * 1000)
  .complete({
    change: { address: userAddr },
    coinSelection: false, // Setting to false to avoid using distributor funds
  }); */
/*  const signedTx = await tx.sign().complete();

  const submittedtxHash = await signedTx.submit();
  
  await lucid.awaitTx(submittedtxHash);
  
  console.log(`Successfully minted tokens with
  policyId: ${policyId},
  tokenName: ${tokenName},
  txHash: ${submittedtxHash}`);
 

*/
