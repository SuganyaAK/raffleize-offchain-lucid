import { Assets, Data, Kind, UTxO } from "@anastasia-labs/lucid-cardano-fork"

/* data RaffleizeMintingReedemer
  = MintRaffle RaffleConfig TxOutRef
  | MintTicket AssetClass
  | Burn AssetClass
  deriving (Generic) */

  /* data RaffleParam = RaffleParam
  { rMaxNoOfTickets :: Integer --- ^ The maximum number of tickets that can be sold for the raffle.
  , rMinRevealingWindow :: Integer --- ^ The minimum no. of milliseconds that must pass between commit deadline and reveal deadline.
  , rMinTicketPrice :: Integer --- ^ The minimum ticket price (expressed in lovelaces).
  , rRaffleValidatorHash :: ScriptHash --- ^ The validator hash of the validation logic for spending the raffle state UTxO.
  , rTicketValidatorHash :: ScriptHash --- ^ The validator hash of the validation logic for spending the ticket state UTxO.
  , rTicketCollateral :: Integer --- ^ The min. no. of lovelaces that must be locked with the ticket state (recovered when ticket ref NFT is burned).
  , rRaffleCollateral :: Integer --- ^ The min. no. of lovelaces that must be locked with the raffle state (recovered when raffle ref. NFT is burned).
  }
  deriving (Generic, Eq) */


  /* export const ScriptHashSchema = Data.Object({
    getScriptHash : Data.Bytes()
  }); */

  const RaffleParamSchema = Data.Object({
    rMaxNoOfTickets : Data.Integer() 
  , rMinRevealingWindow : Data.Integer() 
  , rMinTicketPrice :Data.Integer() 
  , rRaffleValidatorHash : Data.Object({ inline : Data.Bytes()})
  , rTicketValidatorHash : Data.Object({ inline : Data.Bytes()})
  , rTicketCollateral :Data.Integer() 
  , rRaffleCollateral :Data.Integer()
  });

  export type RaffleParam = Data.Static<typeof RaffleParamSchema>;
  export const RaffleParam = RaffleParamSchema as unknown as RaffleParam;


/*   data RaffleizeMintingReedemer
  = MintRaffle RaffleConfig TxOutRef
  | MintTicket AssetClass
  | Burn AssetClass
  deriving (Generic) */

/* data RaffleConfig = RaffleConfig
  { rCommitDDL :: POSIXTime --- ^ The deadline for buying tickets and committing the secrret hash.
  , rRevealDDL :: POSIXTime --- ^ The deadline for reavealing the secrets.
  , rTicketPrice :: Integer --- ^ The ticket price (expressed in lovelaces).
  , rMinTickets :: Integer --- ^ The minimum number of tickets that must be sold for the raffle.
  , rStake :: Value --- ^ The raffle stake value.
  } */

 // Value	
//getValue :: Map CurrencySymbol ( Map TokenName Integer )

/*rStake : Data.Object({Inline :Data.Map(Data.Object({Inline:Data.Bytes()}),
        (Data.Map(Data.Object({Inline : Data.Bytes()}),Data.Integer())))*/ 

export const RaffleConfigSchema = Data.Object({
    rCommitDDL : Data.Object({getPOSIXTime : Data.Integer()})
  , rRevealDDL : Data.Object({getPOSIXTime : Data.Integer()})
  , rTicketPrice : Data.Integer() 
  , rMinTickets : Data.Integer() 
  , rStake : Data.Map(Data.Object({unCurrencySymbol:Data.Bytes()}),(Data.Map(Data.Object({unTokenName : Data.Bytes()}),Data.Integer())))
  });
//});

export type RaffleConfig = Data.Static<typeof RaffleConfigSchema>;
export const RaffleConfig = RaffleConfigSchema as unknown as RaffleConfig;

export const TxOutRefSchema = Data.Object({
    txOutRefId : Data.Object({Inline : Data.Bytes()}),
    txOutRefIdx : Data.Integer()
  }); 

export type TxOutReference = Data.Static<typeof TxOutRefSchema>;
export const TxOutReference = TxOutRefSchema as unknown as TxOutReference;

/*
data RaffleizeMintingReedemer
  = MintRaffle RaffleConfig TxOutRef
  | MintTicket AssetClass
  | Burn AssetClass
  deriving (Generic)

*/

export const RedeemerSchema = Data.Enum ([
  Data.Object({ MintRaffle : Data.Object(RaffleConfigSchema)} ),
  //Data.Object({ MintRaffle : Data.Object({raffleconf : RaffleConfigSchema , txoutref : TxOutRefSchema} ) }),
    //Data.Object({ MintRaffle : RaffleConfigSchema , TxOutRefSchema }), // 1. how to bring the tx out ref 
    Data.Object({ MintTicket : Data.Object({unAssetClass:(Data.Object({unCurrencySymbol:Data.Bytes()}),Data.Object({unTokenName:Data.Bytes()}))}) }), // change the data type of mintticket }),
]);

export type Redeemer = Data.Static<typeof RedeemerSchema>;
export const Redeemer = RedeemerSchema as unknown as Redeemer;
 
/*
data RaffleStateData = RaffleStateData
  { rRaffleID :: AssetClass --- ^ The raffle id is the raffle ref NFT @AssetClass@ (since it is unique).
  , rParam :: RaffleParam --- ^  Raffle parameeters defined by the Protocol Admin.
  , rConfig :: RaffleConfig --- ^  Raffle configuration defined by the Raffle Owner.
  , rSoldTickets :: Integer --- ^  The current number of tickets sold.
  , rRevealedTickets :: Integer --- ^  The current number of tickets revealed.
  , rRefundedTickets :: Integer --- ^  The current number of tickets refunded.
  , rRandomSeed :: Integer --- ^  The current accumulated random seed (is valid only when all tickets sold are revealed).
  }
  deriving (Generic)
 */ 
  
  export const RaffleStateDataSchema = Data.Object({
    rRaffleID : Data.Object({unAssetClass : Data.Object({unCurrencySymbol: Data.Bytes(), unTokenName: Data.Bytes()})})
  , rParam : RaffleParamSchema
  , rConfig : RaffleConfigSchema
  , rSoldTickets : Data.Integer() 
  , rRevealedTickets : Data.Integer()
  , rRefundedTickets : Data.Integer()
  , rRandomSeed : Data.Integer()
  });

  export type RaffleStateData = Data.Static<typeof RaffleStateDataSchema>;
  export const RaffleStateData = RaffleStateDataSchema as unknown as RaffleStateData;

  export const MetadataSchema = Data.Map(Data.Bytes(),Data.Bytes());

  export type Metadata= Data.Static<typeof MetadataSchema>;
  export const Metadata = MetadataSchema as unknown as Metadata;

  export const RaffleDatumSchema = Data.Object({
    metadata : MetadataSchema
    ,version : Data.Integer()
    ,extra : RaffleStateDataSchema
  });

  export type RaffleDatum= Data.Static<typeof RaffleDatumSchema>;
  export const RaffleDatum = RaffleDatumSchema as unknown as RaffleDatum;

  export function getUtxoWithAssets(utxos: UTxO[], minAssets: Assets): UTxO {
    const utxo = utxos.find((utxo) => {
      for (const [unit, value] of Object.entries(minAssets)) {
        if (
          !Object.hasOwn(utxo.assets, unit) || utxo.assets[unit] < value
        ) {
          return false;
        }
      }
      return true;
    });
  
    if (!utxo) {
      throw new Error(
        "No UTxO found containing assets: " +
          JSON.stringify(minAssets, bigIntReplacer),
      );
    }
    return utxo;
  };

  export function bigIntReplacer(_k: any, v: any) {
    return typeof v === "bigint" ? v.toString() : v;
  }



