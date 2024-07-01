
import { Constr, Data, PolicyId, Script, Unit, applyParamsToScript, fromHex, fromText, sha256, toHex, toUnit } from '@anastasia-labs/lucid-cardano-fork';
import script from '../src/raffleizemintingpolicy.json';
import {lucid, userAddr} from '../src/mintorganiserstake.js'
import { MetadataRaffle, RaffleConfig, RaffleConfigSchema, RaffleDatum, RaffleParam, RaffleStateData, Redeemer, TxOutRefSchema, TxOutReference, getUtxoWithAssets } from './Utils.js';
import { NON_FUNGIBLE_TOKEN_LABEL, REFERENCE_TOKEN_LABEL, raffleDescription, raffleImageURI, raffleName } from './common/constants.js';
import { blake2b } from 'blakejs';
import {raffleizeValidatorHash} from '../src/rafflevalidatorhash.js'
import {ticketValidatorHash} from '../src/ticketvalidatorhash.js'

/*onst raffleparam : RaffleParam = {rMaxNoOfTickets : 20n
  , rMinRevealingWindow : 60_000n
  , rMinTicketPrice :2_000_000n
  , rRaffleValidatorHash : {getScriptHash : ""}
  , rTicketValidatorHash : {getScriptHash : ""}
  , rTicketCollateral :2_000_000n
  , rRaffleCollateral :2_000_000n};

console.log("Raffle parameters", raffleparam); // raffle param is parameterized
*/
const raffleizemintingpolicyScript : Script = {
    type : "PlutusV2",
    script : script.cborHex//applyParamsToScript(script.cborHex,[Data.to(raffleparam,RaffleParam)]), // can use the .plutus file directly, no need to create raffle param
}

const raffleizemintingpolicyvaladdr = lucid.utils.validatorToAddress(raffleizemintingpolicyScript);

console.log("Raffle minting policy address",raffleizemintingpolicyvaladdr);

console.log("Utxos at organiser address",await lucid.utxosAt(userAddr));

const userUtxos = await lucid.utxosAt(userAddr);

const selectedUtxo = getUtxoWithAssets(userUtxos, { ["dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d746573747374616b6576616c7565"]: 1n });
// use this selected utxo to create the hash 

console.log("Selected UTXO", selectedUtxo);
const collateral = getUtxoWithAssets(userUtxos,{["lovelace"]:10_000_000n});

 const txHash = selectedUtxo.txHash;
 const txHash256 = blake2b(fromHex(txHash));
  
  const outputIndex = selectedUtxo.outputIndex;

  console.log("TxHash", txHash);
  console.log("TxHash", outputIndex);

  const outputIndexByte = new Uint8Array([outputIndex])
  const tokenName = toHex(outputIndexByte) + toHex((txHash256.slice(0,27)));
  
  //const tokenName = fromHex(tokenNameBytes);
  
  console.log("Token name",tokenName);

const policyId: PolicyId = lucid.utils.mintingPolicyToId(
    raffleizemintingpolicyScript,
  );

  const refNFT = toUnit(
    policyId,
    tokenName, // hash of the utxoref which is used as the stake (input) , similar to seedTxOutRef
    REFERENCE_TOKEN_LABEL,
  );
  
  const userNFT = toUnit(
    policyId,
    tokenName, 
    NON_FUNGIBLE_TOKEN_LABEL// 1. to get the txouterf, 2. hash ,3. crete  a tokenname with that hash
);

console.log("Asset Unit", userNFT);
console.log("Asset Unit", refNFT);

const rafconfig1 : RaffleConfig = {
    rCommitDDL:{ getPOSIXTime : 1815741774000n},
    rRevealDDL:{ getPOSIXTime : 1925631774000n},
    rTicketPrice: 5000000n,
    rMinTickets: 5n,
    rStake: new Map([[{unCurrencySymbol:fromText("dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d")},
            new Map([[{unTokenName: fromText("teststakevalue")},1n]])]])  // new Map([[{uncurrencusymbol: } ,new Map([[{untokenname : "" },1n]])]])
}; 

console.log("Raffle configuration", rafconfig1);

const txoutref : TxOutReference = {
  txOutRefId: {Inline : selectedUtxo.txHash},
  txOutRefIdx: BigInt(outputIndex)
};

const datumStateData : RaffleStateData = { 
  rRaffleID : {unAssetClass: {unCurrencySymbol : policyId,//"dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d",
                              unTokenName : tokenName }}//fromText("teststakevalue")}} // not the stake , rafflemintingpolicyscript is the uncucrrencysymbol
                              // tokenname : refnft and usernft's token name
, rParam :  {rMaxNoOfTickets : 20n
            , rMinRevealingWindow : 6_000n
            , rMinTicketPrice :3_000_000n
            , rRaffleValidatorHash : {inline :raffleizeValidatorHash.script}
            , rTicketValidatorHash : {inline :ticketValidatorHash.script}
            , rTicketCollateral :3_000_000n
            , rRaffleCollateral :3_000_000n}
   
, rConfig : rafconfig1
, rSoldTickets :  0n
, rRevealedTickets : 0n
, rRefundedTickets : 0n
, rRandomSeed : 0n
};

console.log("Raffle state Data", datumStateData);

const cipmetadata : MetadataRaffle = 
  new Map([["description", "raffleDescription"]
    , ["image", "raffleImageURI"]
    , ["name", "raffleName"]]);

const metadata = Data.from(Data.to(cipmetadata,MetadataRaffle),MetadataRaffle);
console.log("CIP metadata",metadata);

const raffledatum : RaffleDatum = {
  //metadata : cipmetadata,
 version : 1n
 ,extra : datumStateData
};

const metadatum = Data.to(new Constr(0, [cipmetadata]));
//const metadatum = Data.to(raffledatum,RaffleDatum);

console.log("RaffleDatum", metadatum);

const redeemer : Redeemer = {MintRaffle:{config: rafconfig1,outref : txoutref}};

const newRedeemer = Data.to(redeemer,Redeemer);

console.log("Redeemer",newRedeemer);

console.log("utxos at user addr", await lucid.utxosAt(userAddr))
/*
 const tx = await lucid
  .newTx()
  .collectFrom([selectedUtxo])  // utxo with raffle stake
  .collectFrom([collateral]) // utxo with lovelace = 10_000_000n
  .mintAssets({[userNFT]: 1n, [refNFT]: 1n }, newRedeemer) // minting user NFT and ref NFT
  .attachMintingPolicy(raffleizemintingpolicyScript)
  .payToAddress(userAddr, { [userNFT]: 1n })
   .payToContract(raffleizemintingpolicyvaladdr, { inline: metadatum }, {[refNFT]: 1n,
   })
  //.addSigner(issuerAddr)
  .addSigner(userAddr)
  .complete();

  console.log("txoutput", tx); 

  const signedTx = await tx.sign().complete();

  const submittedtxHash = await signedTx.submit();

  console.log("submitted tx hash",submittedtxHash);

/*
  const tx = await lucid
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
  }); 
*/
/*   const signedTx = await tx.sign().complete();

  const submittedtxHash = await signedTx.submit();
  
  await lucid.awaitTx(submittedtxHash);
  
  console.log(`Successfully minted tokens with
  policyId: ${policyId},
  tokenName: ${tokenName},
  txHash: ${submittedtxHash}`); */
 



