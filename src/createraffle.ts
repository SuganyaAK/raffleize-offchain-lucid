
import { Data, PolicyId, Script, Unit, fromText } from '@anastasia-labs/lucid-cardano-fork';
import script from '../src/raffleizemintingpolicy.json';
import {addr,paymentCredential,lucid} from '../src/mintorganiserstake.js'
import { RaffleParam } from './Utils.js';

const raffleizemintingpolicyScript : Script = {
    type : "PlutusV2",
    script : script.cborHex
}

const raffleizemintingpolicyvaladdr = lucid.utils.validatorToAddress(raffleizemintingpolicyScript);

console.log("Raffle minting policy address",raffleizemintingpolicyvaladdr);

console.log("Utxos at organiser address",await lucid.utxosAt(addr));

const policyId: PolicyId = lucid.utils.mintingPolicyToId(
    raffleizemintingpolicyScript,
  );
const userNFT: Unit = 222+ policyId + fromText("RaffleNFT");
 console.log("Asset Unit", userNFT);

const referenceNFT: Unit = 100+ policyId + fromText("RaffleNFT");
console.log("Asset Unit", referenceNFT);

const raffleparam = Data.to({},RaffleParam)

/* const tx = await lucid.newTx()
            .attachMintingPolicy(raffleizemintingpolicyScript)
            .mintAssets({[userNFT] :1n,[referenceNFT]:1n}) // I need to mint user nft and reference nft
            .complete();                     // other condition is to add whether the redeemer is mintraffle

 */

