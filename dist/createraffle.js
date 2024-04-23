import script from '../src/raffleizemintingpolicy.json';
import { lucid } from '../src/mintorganiserstake.js';
const raffleizemintingpolicyScript = {
    type: "PlutusV2",
    script: script.cborHex
};
const raffleizemintingpolicyvaladdr = lucid.utils.validatorToAddress(raffleizemintingpolicyScript);
console.log("Raffle minting policy address", raffleizemintingpolicyvaladdr);
