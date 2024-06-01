
import { Constr, Data, PolicyId, Script, Unit, applyParamsToScript, fromText, toUnit } from '@anastasia-labs/lucid-cardano-fork';
import script from '../src/raffleizemintingpolicy.json';
import {lucid, userAddr} from '../src/mintorganiserstake.js'
import { Metadata, RaffleConfig, RaffleConfigSchema, RaffleDatum, RaffleParam, RaffleStateData, Redeemer, TxOutRefSchema, TxOutReference, getUtxoWithAssets } from './Utils.js';
import { NON_FUNGIBLE_TOKEN_LABEL, REFERENCE_TOKEN_LABEL } from './common/constants.js';


const raffleparam : RaffleParam = {rMaxNoOfTickets : 20n
  , rMinRevealingWindow : 60_000n
  , rMinTicketPrice :2_000_000n
  , rRaffleValidatorHash : {getScriptHash : ""}
  , rTicketValidatorHash : {getScriptHash : ""}
  , rTicketCollateral :2_000_000n
  , rRaffleCollateral :2_000_000n};

console.log("Raffle parameters", raffleparam);

const raffleizemintingpolicyScript : Script = {
    type : "PlutusV2",
    script : applyParamsToScript(script.cborHex,[Data.to(raffleparam,RaffleParam)]),
}

const raffleizemintingpolicyvaladdr = lucid.utils.validatorToAddress(raffleizemintingpolicyScript);

console.log("Raffle minting policy address",raffleizemintingpolicyvaladdr);

console.log("Utxos at organiser address",await lucid.utxosAt(userAddr));

const policyId: PolicyId = lucid.utils.mintingPolicyToId(
    raffleizemintingpolicyScript,
  );

  const refNFT = toUnit(
    policyId,
    "RaffleNFT",
    REFERENCE_TOKEN_LABEL,
  );
  
  const userNFT = toUnit(
    policyId,
    "RaffleNFT",
    NON_FUNGIBLE_TOKEN_LABEL,
  );

console.log("Asset Unit", userNFT);
console.log("Asset Unit", refNFT);

const rafconfig1 : RaffleConfig = {
    rCommitDDL:{ getPOSIXTime : 1815741774000n},
    rRevealDDL:{ getPOSIXTime : 1925631774000n},
    rTicketPrice: 5000000n,
    rMinTickets: 5n,
    rStake: new Map([[{unCurrencySymbol:fromText("dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d")},
            new Map([[{unTokenName: fromText("teststake")},1n]])]])  // new Map([[{uncurrencusymbol: } ,new Map([[{untokenname : "" },1n]])]])
}; 

console.log("Raffle configuration", rafconfig1);
const redeemer = Data.to ({MintRaffle:{
    rCommitDDL:{ getPOSIXTime : 1815741774000n},
    rRevealDDL:{ getPOSIXTime : 1925631774000n},
    rTicketPrice: 15000000n,
    rMinTickets: 5n,
    rStake: new Map([[{unCurrencySymbol:"dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d"},
            new Map([[{unTokenName: fromText("teststakevalue")},1n]])]])  // new Map([[{uncurrencusymbol: } ,new Map([[{untokenname : "" },1n]])]])
}  },Redeemer);

console.log("Mint Raffle Redeemer:", redeemer);
const userUtxos = await lucid.utxosAt(userAddr);
const selectedUtxo = getUtxoWithAssets(userUtxos, { ["dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d746573747374616b6576616c7565"]: 1n });
const collateral = getUtxoWithAssets(userUtxos,{["lovelace"]:10_000_000n});

//const metadata1 = Data.to({},Metadata);

const datumStateData : RaffleStateData = { 
  rRaffleID : {unAssetClass: {unCurrencySymbol : "dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d",
                              unTokenName : fromText("teststakevalue")}}
, rParam :  {rMaxNoOfTickets : 20n
            , rMinRevealingWindow : 60_000n
            , rMinTicketPrice :2_000_000n
            , rRaffleValidatorHash : {getScriptHash : ""}
            , rTicketValidatorHash : {getScriptHash : ""}
            , rTicketCollateral :2_000_000n
            , rRaffleCollateral :2_000_000n}
, rConfig : {rCommitDDL:{ getPOSIXTime : 1815741774000n},
            rRevealDDL:{ getPOSIXTime : 1925631774000n},
            rTicketPrice: 5000000n,
            rMinTickets: 5n,
            rStake: new Map([[{unCurrencySymbol:fromText("dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d")},
                    new Map([[{unTokenName: fromText("teststake")},1n]])]])  }
, rSoldTickets : 5n
, rRevealedTickets : 2n
, rRefundedTickets : 3n
, rRandomSeed : 120n
}

const raffledatum : RaffleDatum = {
  metadata : new Map ([["dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d", "teststake"]])
 ,version : 1n
 ,extra : datumStateData
};


const tx = await lucid
  .newTx()
  .collectFrom([selectedUtxo])  // utxo with raffle stake
  .collectFrom([collateral]) // utxo with lovelace = 10_000_000n
  .mintAssets({ [userNFT]: 1n, [refNFT]: 1n }, redeemer) // minting user NFT and ref NFT
  .attachMintingPolicy(raffleizemintingpolicyScript)
  .payToAddress(userAddr, { [userNFT]: 1n })
  .payToContract(raffleizemintingpolicyvaladdr, { inline: Data.to(raffledatum,RaffleDatum) }, {
    [refNFT]: 1n,
  })
  //.addSigner(issuerAddr)
  .addSigner(userAddr)
  .complete();

 

            
