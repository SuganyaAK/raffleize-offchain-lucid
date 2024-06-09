"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAddr = exports.lucid = void 0;
var lucid_cardano_fork_1 = require("@anastasia-labs/lucid-cardano-fork");
exports.lucid = await lucid_cardano_fork_1.Lucid.new(new lucid_cardano_fork_1.Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "previewL7VRnBQHYkBR9rd6GrKvSzRuCQ7JgTml"), "Preview");
//const api = await window.cardano.nami.enable();
// Assumes you are in a browser environment
//lucid.selectWallet(api);
//const seed = lucid.utils.generateSeedPhrase();
exports.lucid.selectWalletFromSeed("absorb another vanish tonight blind dove odor female isolate other proof length shiver love crack plastic coffee ginger explain rally acid vapor glance another");
exports.userAddr = await exports.lucid.wallet.address();
console.log("Address", exports.userAddr);
/*
 export const { paymentCredential } = lucid.utils.getAddressDetails(
   userAddr,
 );

console.log("utxos at addr after minting",await lucid.utxosAt(userAddr));
const userUtxos = await lucid.utxosAt(userAddr);

//["lovelace"]: 5000000n,

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
