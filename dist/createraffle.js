import { Data, applyParamsToScript, fromText } from '@anastasia-labs/lucid-cardano-fork';
import script from '../src/raffleizemintingpolicy.json';
import { addr, lucid } from '../src/mintorganiserstake.js';
import { RaffleParam } from './Utils.js';
const raffleparam = Data.to({ rMaxNoOfTickets: 20n,
    rMinRevealingWindow: 60000n,
    rMinTicketPrice: 2000000n,
    rRaffleValidatorHash: { getScriptHash: "" },
    rTicketValidatorHash: { getScriptHash: "" },
    rTicketCollateral: 2000000n,
    rRaffleCollateral: 2000000n }, RaffleParam);
const raffleizemintingpolicyScript = {
    type: "PlutusV2",
    script: applyParamsToScript(script.cborHex, [raffleparam]),
};
const raffleizemintingpolicyvaladdr = lucid.utils.validatorToAddress(raffleizemintingpolicyScript);
console.log("Raffle minting policy address", raffleizemintingpolicyvaladdr);
console.log("Utxos at organiser address", await lucid.utxosAt(addr));
const policyId = lucid.utils.mintingPolicyToId(raffleizemintingpolicyScript);
const userNFT = 222 + policyId + fromText("RaffleNFT");
console.log("Asset Unit", userNFT);
const referenceNFT = 100 + policyId + fromText("RaffleNFT");
console.log("Asset Unit", referenceNFT);
console.log("Raffle parameters", raffleparam);
/* const rafconfig = Data.to({
    rCommitDDL : Data.Object({getPOSIXTime : Data.Integer()})
, rRevealDDL : Data.Object({getPOSIXTime : Data.Integer()})
, rTicketPrice : Data.Integer()
, rMinTickets : Data.Integer()
, rStake : Data.Map(),RedeemerMintingPolicy}); */
//const mintRdmr = Data.to(new Constr(0, []));
//const redeemer = Data.to (MintRaffle rafconfig, txoutf ,RedeemerMintingPolicy)
/* const tx = await lucid
            .newTx()
            .attachMintingPolicy(raffleizemintingpolicyScript)
            .mintAssets({[userNFT] :1n,[referenceNFT]:1n},mintRdmr) // I need to mint user nft and reference nft
            .complete();   */ // other condition is to add whether the redeemer is mintraffle
