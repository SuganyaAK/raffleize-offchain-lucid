import { Data, Script, applyParamsToScript } from "@anastasia-labs/lucid-cardano-fork";
import { lucid } from "./mintorganiserstake.js";
import script from '../src/raffleizevalidator.json'

//lucid.selectWalletFromSeed("absorb another vanish tonight sight dove odor female isolate other proof length shover love crack plastic coffee ginger exploit rally acid vapor glance another");
 
//export const adminAddr = await lucid.wallet.address();
//console.log("Address", adminAddr);

const pubkeyhash = "a2c20c77887ace1cd986193e4e75babd8993cfd56995cd5cfce609c2"
console.log("Pub key hash", pubkeyhash);

export const raffleizeValidatorHash : Script = {
    type : "PlutusV2",
    script : applyParamsToScript(script.cborHex,[pubkeyhash]), // can use the .plutus file directly, no need to create raffle param
  }
