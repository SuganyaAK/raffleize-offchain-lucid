"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigIntReplacer = exports.getUtxoWithAssets = exports.RaffleDatum = exports.RaffleDatumSchema = exports.Metadata = exports.MetadataSchema = exports.RaffleStateData = exports.RaffleStateDataSchema = exports.Redeemer = exports.RedeemerSchema = exports.TxOutReference = exports.TxOutRefSchema = exports.RaffleConfig = exports.RaffleConfigSchema = exports.RaffleParam = void 0;
var lucid_cardano_fork_1 = require("@anastasia-labs/lucid-cardano-fork");
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
var RaffleParamSchema = lucid_cardano_fork_1.Data.Object({
    rMaxNoOfTickets: lucid_cardano_fork_1.Data.Integer(),
    rMinRevealingWindow: lucid_cardano_fork_1.Data.Integer(),
    rMinTicketPrice: lucid_cardano_fork_1.Data.Integer(),
    rRaffleValidatorHash: lucid_cardano_fork_1.Data.Object({ inline: lucid_cardano_fork_1.Data.Bytes() }),
    rTicketValidatorHash: lucid_cardano_fork_1.Data.Object({ inline: lucid_cardano_fork_1.Data.Bytes() }),
    rTicketCollateral: lucid_cardano_fork_1.Data.Integer(),
    rRaffleCollateral: lucid_cardano_fork_1.Data.Integer()
});
exports.RaffleParam = RaffleParamSchema;
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
exports.RaffleConfigSchema = lucid_cardano_fork_1.Data.Object({
    rCommitDDL: lucid_cardano_fork_1.Data.Object({ getPOSIXTime: lucid_cardano_fork_1.Data.Integer() }),
    rRevealDDL: lucid_cardano_fork_1.Data.Object({ getPOSIXTime: lucid_cardano_fork_1.Data.Integer() }),
    rTicketPrice: lucid_cardano_fork_1.Data.Integer(),
    rMinTickets: lucid_cardano_fork_1.Data.Integer(),
    rStake: lucid_cardano_fork_1.Data.Map(lucid_cardano_fork_1.Data.Object({ unCurrencySymbol: lucid_cardano_fork_1.Data.Bytes() }), (lucid_cardano_fork_1.Data.Map(lucid_cardano_fork_1.Data.Object({ unTokenName: lucid_cardano_fork_1.Data.Bytes() }), lucid_cardano_fork_1.Data.Integer())))
});
exports.RaffleConfig = exports.RaffleConfigSchema;
exports.TxOutRefSchema = lucid_cardano_fork_1.Data.Object({
    txOutRefId: lucid_cardano_fork_1.Data.Object({ Inline: lucid_cardano_fork_1.Data.Bytes() }),
    txOutRefIdx: lucid_cardano_fork_1.Data.Integer()
});
exports.TxOutReference = exports.TxOutRefSchema;
exports.RedeemerSchema = lucid_cardano_fork_1.Data.Enum([
    lucid_cardano_fork_1.Data.Object({ MintRaffle: lucid_cardano_fork_1.Data.Object({ x: exports.RaffleConfigSchema, y: exports.TxOutRefSchema }) }),
    //Data.Object({ MintRaffle : RaffleConfigSchema , TxOutRefSchema }), // 1. how to bring the tx out ref 
    lucid_cardano_fork_1.Data.Object({ MintTicket: lucid_cardano_fork_1.Data.Object({ unAssetClass: (lucid_cardano_fork_1.Data.Object({ unCurrencySymbol: lucid_cardano_fork_1.Data.Bytes() }), lucid_cardano_fork_1.Data.Object({ unTokenName: lucid_cardano_fork_1.Data.Bytes() })) }) }), // change the data type of mintticket }),
]);
exports.Redeemer = exports.RedeemerSchema;
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
exports.RaffleStateDataSchema = lucid_cardano_fork_1.Data.Object({
    rRaffleID: lucid_cardano_fork_1.Data.Object({ unAssetClass: lucid_cardano_fork_1.Data.Object({ unCurrencySymbol: lucid_cardano_fork_1.Data.Bytes(), unTokenName: lucid_cardano_fork_1.Data.Bytes() }) }),
    rParam: RaffleParamSchema,
    rConfig: exports.RaffleConfigSchema,
    rSoldTickets: lucid_cardano_fork_1.Data.Integer(),
    rRevealedTickets: lucid_cardano_fork_1.Data.Integer(),
    rRefundedTickets: lucid_cardano_fork_1.Data.Integer(),
    rRandomSeed: lucid_cardano_fork_1.Data.Integer()
});
exports.RaffleStateData = exports.RaffleStateDataSchema;
exports.MetadataSchema = lucid_cardano_fork_1.Data.Map(lucid_cardano_fork_1.Data.Bytes(), lucid_cardano_fork_1.Data.Bytes());
exports.Metadata = exports.MetadataSchema;
exports.RaffleDatumSchema = lucid_cardano_fork_1.Data.Object({
    metadata: exports.MetadataSchema,
    version: lucid_cardano_fork_1.Data.Integer(),
    extra: exports.RaffleStateDataSchema
});
exports.RaffleDatum = exports.RaffleDatumSchema;
function getUtxoWithAssets(utxos, minAssets) {
    var utxo = utxos.find(function (utxo) {
        for (var _i = 0, _a = Object.entries(minAssets); _i < _a.length; _i++) {
            var _b = _a[_i], unit = _b[0], value = _b[1];
            if (!Object.hasOwn(utxo.assets, unit) || utxo.assets[unit] < value) {
                return false;
            }
        }
        return true;
    });
    if (!utxo) {
        throw new Error("No UTxO found containing assets: " +
            JSON.stringify(minAssets, bigIntReplacer));
    }
    return utxo;
}
exports.getUtxoWithAssets = getUtxoWithAssets;
;
function bigIntReplacer(_k, v) {
    return typeof v === "bigint" ? v.toString() : v;
}
exports.bigIntReplacer = bigIntReplacer;
