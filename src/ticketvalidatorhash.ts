import { Data, Script, applyParamsToScript } from "@anastasia-labs/lucid-cardano-fork"
import script from '../src/ticketvalidator.json'

const pubkeyhash = "a2c20c77887ace1cd986193e4e75babd8993cfd56995cd5cfce609c2"

export const ticketValidatorHash : Script = {
    type : "PlutusV2",
    script : applyParamsToScript(script.cborHex,[Data.to(pubkeyhash)]), // can use the .plutus file directly, no need to create raffle param
  }