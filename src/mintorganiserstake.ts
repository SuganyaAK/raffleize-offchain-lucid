import { Assets, Blockfrost, Lucid, MintingPolicy, PolicyId, TxHash, Unit, fromText, generateSeedPhrase, getAddressDetails, toUnit } from "@anastasia-labs/lucid-cardano-fork";
import { getUtxoWithAssets } from "./Utils.js";

export const lucid = await Lucid.new(new Blockfrost(
   "https://cardano-preview.blockfrost.io/api/v0",
    "previewL7VRnBQHYkBR9rd6GrKvSzRuCQ7JgTml",
  ),
 "Preview",);

 //const api = await window.cardano.nami.enable();
 // Assumes you are in a browser environment
 //lucid.selectWallet(api);
 //const seed = lucid.utils.generateSeedPhrase();
 lucid.selectWalletFromSeed("absorb another vanish tonight blind dove odor female isolate other proof length shiver love crack plastic coffee ginger explain rally acid vapor glance another");
 
 export const userAddr = await lucid.wallet.address();
 console.log("Address", userAddr);

 export const { paymentCredential } = lucid.utils.getAddressDetails(
   userAddr,
 );

console.log("utxos at addr after minting",await lucid.utxosAt(userAddr));
const userUtxos = await lucid.utxosAt(userAddr);

//["lovelace"]: 5000000n,
/*
const mintingPolicy: MintingPolicy = lucid.utils.nativeScriptFromJson(
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
 
 export async function mintNFT(
  name: string,
): Promise<TxHash> {
  const unit: Unit = policyId + fromText(name);

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: 1n })
    .payToAddress(userAddr,{lovelace : 10_000_000n})
    .validTo(Date.now() + 100000)
    .attachMintingPolicy(mintingPolicy)
    .complete();

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  return txHash;
}

mintNFT("teststakevalue");
 */
//console.log ("Transaction hash",txHash); 

//console.log("utxos at addr after minting",await lucid.utxosAt(userAddr));

