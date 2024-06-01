import { Data } from "@anastasia-labs/lucid-cardano-fork";
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
    getScriptHash: Data.Bytes()
});
const RaffleParamSchema = Data.Object({
    rMaxNoOfTickets: Data.Integer(),
    rMinRevealingWindow: Data.Integer(),
    rMinTicketPrice: Data.Integer(),
    rRaffleValidatorHash: ScriptHashSchema,
    rTicketValidatorHash: ScriptHashSchema,
    rTicketCollateral: Data.Integer(),
    rRaffleCollateral: Data.Integer()
});
export const RaffleParam = RaffleParamSchema;
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
export const RaffleConfigSchema = Data.Object({
    rCommitDDL: Data.Object({ getPOSIXTime: Data.Integer() }),
    rRevealDDL: Data.Object({ getPOSIXTime: Data.Integer() }),
    rTicketPrice: Data.Integer(),
    rMinTickets: Data.Integer(),
    rStake: Data.Object({ Inline: Data.Map(Data.Object({ Inline: Data.Bytes() }), (Data.Map(Data.Object({ Inline: Data.Bytes() }), Data.Integer())))
    })
});
export const RaffleConfig = RaffleConfigSchema;
export const TxOutRefSchema = Data.Object({
    txOutRefId: Data.Object({ Inline: Data.Bytes() }),
    txOutRefIdx: Data.Integer()
});
export const TxOutReference = TxOutRefSchema;
export const RedeemerSchema = Data.Enum([
    Data.Object({ MintRaffle: RaffleConfigSchema, TxOutRefSchema }),
    Data.Object({ MintTicket: Data.Object({ unAssetClass: (Data.Object({ unCurrencySymbol: Data.Bytes() }), Data.Object({ unTokenName: Data.Bytes() })) }) }), // change the data type of mintticket }),
]);
export const RedeemerMintingPolicy = RedeemerSchema;
