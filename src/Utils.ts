import { Data } from "@anastasia-labs/lucid-cardano-fork"

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


  export const ScriptHashSchema = Data.Object({
    getScriptHash : Data.Bytes()
  });

  const RaffleParamSchema = Data.Object({
    rMaxNoOfTickets : Data.Integer() 
  , rMinRevealingWindow : Data.Integer() 
  , rMinTicketPrice :Data.Integer() 
  , rRaffleValidatorHash : ScriptHashSchema 
  , rTicketValidatorHash : ScriptHashSchema 
  , rTicketCollateral :Data.Integer() 
  , rRaffleCollateral :Data.Integer()
  });

  export type RaffleParam = Data.Static<typeof RaffleParamSchema>;
  export const RaffleParam = RaffleParamSchema as unknown as RaffleParam;

   /*  newtype ScriptHash =
    ScriptHash { getScriptHash :: Builtins.BuiltinByteString } */

   // data PSimpleSale (s :: S)
  //   = PSimpleSale
  //       ( Term
  //           s
  //           ( PDataRecord
  //               '[ "sellerAddress" ':= PAddress
  //                , "priceOfAsset" ':= PInteger
  //                ]
  //           )
  //       )
  /* 
  const SimpleSaleSchema = Data.Object({
    sellerAddress: AddressSchema,
    priceOfAsset: Data.Integer(),
  });

  export type SimpleSale = Data.Static<typeof SimpleSaleSchema>;
  export const SimpleSale = SimpleSaleSchema as unknown as SimpleSale; */