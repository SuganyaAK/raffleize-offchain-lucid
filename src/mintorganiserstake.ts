import { Assets, Blockfrost, Lucid, MintingPolicy, PolicyId, TxHash, Unit, fromText, generateSeedPhrase, getAddressDetails, toUnit } from "@anastasia-labs/lucid-cardano-fork";
//import script from './mynftminting.json' 
//import assert from "assert";
//import test from "node:test";
//import { test } from 'vitest'
//import type {mintNFT} from './createraffle.ts';



export const lucid = await Lucid.new(new Blockfrost(
   "https://cardano-preview.blockfrost.io/api/v0",
    "previewL7VRnBQHYkBR9rd6GrKvSzRuCQ7JgTml",
  ),
 "Preview",);

 //const api = await window.cardano.nami.enable();
 // Assumes you are in a browser environment
 //lucid.selectWallet(api);
 lucid.selectWalletFromSeed("damage laugh drive life gate expose camp spoon error uphold cry crush black blame rebuild film lake east keep army margin unlock toy memory");
 export const addr = await lucid.wallet.address();

 export const { paymentCredential } = lucid.utils.getAddressDetails(
   addr,
 );

 console.log("Address", addr);

 /* const mintingPolicy: MintingPolicy = lucid.utils.nativeScriptFromJson(
   {
     type: "all",
     scripts: [
       { type: "sig", keyHash: paymentCredential?.hash! },
       {
         type: "before",
         slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),
       },
     ],
   },
 );
 
 const policyId: PolicyId = lucid.utils.mintingPolicyToId(
   mintingPolicy,
 );
 console.log("Policy Id",policyId);
 
  //export async function mintNFT(
  // name: string,
 //): Promise<TxHash> {
  
 const unit: Unit = policyId + fromText("coin");
 console.log("Asset Unit", unit);
 
   const tx = await lucid
     .newTx()
     .mintAssets({ [unit]: 1n })
     .validTo(Date.now() + 100000)
     .attachMintingPolicy(mintingPolicy)
     .complete();
 
   const signedTx = await tx.sign().complete();
 
   const txHash = await signedTx.submit();
 
   //return txHash;
// }



 console.log ("Transaction hash",txHash); 

 console.log("utxos at addr after minting",await lucid.utxosAt(addr));
 console.log("utxos at addr after minting",await lucid.wallet.getUtxos());
 */