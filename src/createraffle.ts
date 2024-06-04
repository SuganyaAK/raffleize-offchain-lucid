
import { Constr, Data, PolicyId, Script, Unit, applyParamsToScript, fromText, toHex, toUnit } from '@anastasia-labs/lucid-cardano-fork';
import script from '../src/raffleizemintingpolicy.json';
import {lucid, userAddr} from '../src/mintorganiserstake.js'
import { RaffleConfig, RaffleConfigSchema, RaffleDatum, RaffleParam, RaffleStateData, Redeemer, TxOutRefSchema, TxOutReference, getUtxoWithAssets } from './Utils.js';
import { NON_FUNGIBLE_TOKEN_LABEL, REFERENCE_TOKEN_LABEL, raffleDescription, raffleImageURI, raffleName } from './common/constants.js';
import { encode } from 'punycode';


const raffleparam : RaffleParam = {rMaxNoOfTickets : 20n
  , rMinRevealingWindow : 60_000n
  , rMinTicketPrice :2_000_000n
  , rRaffleValidatorHash : {getScriptHash : ""}
  , rTicketValidatorHash : {getScriptHash : ""}
  , rTicketCollateral :2_000_000n
  , rRaffleCollateral :2_000_000n};

console.log("Raffle parameters", raffleparam); // raffle param is parameterized

const raffleizemintingpolicyScript : Script = {
    type : "PlutusV2",
    script : applyParamsToScript(script.cborHex,[Data.to(raffleparam,RaffleParam)]), // can use the .plutus file directly, no need to create raffle param
}

const raffleizemintingpolicyvaladdr = lucid.utils.validatorToAddress(raffleizemintingpolicyScript);

console.log("Raffle minting policy address",raffleizemintingpolicyvaladdr);

console.log("Utxos at organiser address",await lucid.utxosAt(userAddr));

const policyId: PolicyId = lucid.utils.mintingPolicyToId(
    raffleizemintingpolicyScript,
  );

  const refNFT = toUnit(
    policyId,
    "RaffleNFT", // hash of the utxoref which is used as the stake (input) , similar to seedTxOutRef
    REFERENCE_TOKEN_LABEL,
  );
  
  const userNFT = toUnit(
    policyId,
    "RaffleNFT", // 1. to get the txouterf, 2. hash ,3. crete  a tokenname with that hash
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
            new Map([[{unTokenName: fromText("teststakevalue")},1n]])]])  // new Map([[{uncurrencusymbol: } ,new Map([[{untokenname : "" },1n]])]])
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
// use this selected utxo to create the hash 
const collateral = getUtxoWithAssets(userUtxos,{["lovelace"]:10_000_000n});

//const metadata1 = Data.to({},Metadata);

const datumStateData : RaffleStateData = { 
  rRaffleID : {unAssetClass: {unCurrencySymbol : "dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d",
                              unTokenName : fromText("teststakevalue")}} // not the stake , rafflemintingpolicyscript is the uncucrrencysymbol
                              // tokenname : refnft and usernft's token name
, rParam :  {rMaxNoOfTickets : 20n
            , rMinRevealingWindow : 60_000n
            , rMinTicketPrice :2_000_000n
            , rRaffleValidatorHash : {getScriptHash : ""}
            , rTicketValidatorHash : {getScriptHash : ""}
            , rTicketCollateral :2_000_000n
            , rRaffleCollateral :2_000_000n}
            /*{ rMaxNoOfTickets = 20
    , rMinRevealingWindow = 6_000 --- ^ Miliseconds
    , rMinTicketPrice = 3_000_000 --- ^ Lovelaces
    , rRaffleValidatorHash = raffleizeValidatorHashPlutus
    , rTicketValidatorHash = ticketValidatorHashPlutus
    , rTicketCollateral = 3_000_000 --- ^ Lovelaces
    , rRaffleCollateral = 3_000_000 --- ^ Lovelaces
    }*/ 
, rConfig : {rCommitDDL:{ getPOSIXTime : 1815741774000n},
            rRevealDDL:{ getPOSIXTime : 1925631774000n},
            rTicketPrice: 5000000n,
            rMinTickets: 5n,
            rStake: new Map([[{unCurrencySymbol:fromText("dc7fc077e20b22150409f2c991161536acfd4ed1a0fecacd7a6fb87d")},
                    new Map([[{unTokenName: fromText("teststake")},1n]])]])  }
, rSoldTickets : 5n // 0
, rRevealedTickets : 2n //0
, rRefundedTickets : 3n //0
, rRandomSeed : 120n //0
}

/* type Metadata = {
  raffleImageURI : string;
  raffleDescription: string;
  raffleName: string;
   [key: string]: unknown;
}; */

type Metadata = {
  name: string;
  image: string;
  mediaType?: string;
  description?: string;
  //files?: FilesDetails[];
  [key: string]: unknown;
};
/*
// list of key, value pairs- from this list, i should convert to Map(k,v)
[ ("description", raffleDescription)
  , ("image", raffleImageURI)
  , ("name", raffleName)
]
*/
// export const MetadataSchema = Data.Map(Data.Bytes(),Data.Bytes());
const raffledatum : RaffleDatum = {
  metadata : new Map([])
 ,version : 1n
 ,extra : datumStateData
};

const tx = await lucid
  .newTx()
  .collectFrom([selectedUtxo])  // utxo with raffle stake
  .collectFrom([collateral]) // utxo with lovelace = 10_000_000n
  .mintAssets({[userNFT]: 1n, [refNFT]: 1n }, redeemer) // minting user NFT and ref NFT
  .attachMintingPolicy(raffleizemintingpolicyScript)
  .payToAddress(userAddr, { [userNFT]: 1n })
  .payToContract(raffleizemintingpolicyvaladdr, { inline: Data.to(raffledatum,RaffleDatum) }, {
    [refNFT]: 1n,
  })
  //.addSigner(issuerAddr)
  .addSigner(userAddr)
  .complete();

 

            
