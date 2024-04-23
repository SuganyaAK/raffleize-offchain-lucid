"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintNFT = void 0;
var lucid_cardano_fork_1 = require("@anastasia-labs/lucid-cardano-fork");
//import test from "node:test";
//import { test } from 'vitest'
var lucid = await lucid_cardano_fork_1.Lucid.new(new lucid_cardano_fork_1.Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "previewL7VRnBQHYkBR9rd6GrKvSzRuCQ7JgTml"), "Preview");
//const api = await window.cardano.nami.enable();
// Assumes you are in a browser environment
//lucid.selectWallet(api);
lucid.selectWalletFromSeed("damage laugh drive life gate expose camp spoon error uphold cry crush black blame rebuild film lake east keep army margin unlock toy memory");
var addr = await lucid.wallet.address();
var paymentCredential = lucid.utils.getAddressDetails(addr).paymentCredential;
console.log("Address", addr);
var mintingPolicy = lucid.utils.nativeScriptFromJson({
    type: "all",
    scripts: [
        { type: "sig", keyHash: paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.hash },
        {
            type: "before",
            slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),
        },
    ],
});
var policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
function mintNFT(name) {
    return __awaiter(this, void 0, void 0, function () {
        var unit, tx, signedTx, txHash;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    unit = policyId + (0, lucid_cardano_fork_1.fromText)(name);
                    return [4 /*yield*/, lucid
                            .newTx()
                            .mintAssets((_a = {}, _a[unit] = 1n, _a))
                            .validTo(Date.now() + 100000)
                            .attachMintingPolicy(mintingPolicy)
                            .complete()];
                case 1:
                    tx = _b.sent();
                    return [4 /*yield*/, tx.sign().complete()];
                case 2:
                    signedTx = _b.sent();
                    return [4 /*yield*/, signedTx.submit()];
                case 3:
                    txHash = _b.sent();
                    return [2 /*return*/, txHash];
            }
        });
    });
}
exports.mintNFT = mintNFT;
console.log("utxos at addr after minting", await lucid.wallet.getUtxos());
//const lucid = await Lucid.new();
//const api = await window.cardano.nami.enable();
//lucid.selectWallet(api);
//const seed = lucid.utils.generateSeedPhrase();
//console.log(seed);
/* lucid.selectWalletFromSeed("damage laugh drive life gate expose camp spoon error uphold cry crush black blame rebuild film lake east keep army margin unlock toy memory");

const address = await lucid.wallet.address();
const balance = await lucid.wallet.getUtxos();

console.log ("Balance:",balance);

console.log ("Address:",address);

const utxos =await lucid.utxosAt(address);

console.log ("Utxos at the address created by seed:", utxos);

const tx = await lucid.newTx()
  .payToAddress(address, { lovelace: 1000000n })
  .complete();
//console.log(tx.txComplete.to_json);


const signedTx = await tx.sign().complete();
const txHash = await signedTx.submit();



//await lucid.awaitTx(txHash);

console.log("Tx hash:",txHash); */
//console.log("utxos after adding 1 ada",await lucid.utxosAt(address));
/* const mintingPolicyScript: Script = {
    type: "PlutusV2",
    script:
        "5909e55909e20100003323322332232323232323232323232323232323232323232323232323222322323253353232350082235003223500222222222222233355301b120013233501d223335003220020020013500122001123300122533500210011034033200133503353353233355301c120013501b501e23500122253353301e003005153353301e002014132333573466e1c0080040e00dccd405d20014800840d840d8cc0c140d4024d404488cccd40048c98c80c0cd5ce2481024c680003020012326320303357389201024c68000302326320303357389201024c68000301032133573892010c57726f6e6720616d6f756e74000315335012150341332233002533533355301d120013501c501f235001225335333573466e3cd400888008d4054880080dc0d84ccd5cd19b8735002220013501522001037036103600e103413357389201185554584f20697320636f6e73756d656420616c726561647900033001503350343333573466e1cd55cea801a4000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd4070074d5d0a80619a80e00e9aba1500b33501c01e35742a014666aa040eb9407cd5d0a804999aa8103ae501f35742a01066a03804a6ae85401cccd54080099d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40c1d69aba150023031357426ae8940088c98c80cccd5ce01a01981889aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a8183ad35742a00460626ae84d5d1280111931901999ab9c034033031135573ca00226ea8004d5d09aba2500223263202f33573806005e05a26aae7940044dd50009aba1500533501c75c6ae854010ccd540800888004d5d0a801999aa8103ae200135742a00460486ae84d5d1280111931901599ab9c02c02b029135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00660286ae84d5d1280191931900e99ab9c01e01d01b3333573466e1d40112002212200223333573466e1d40152000212200123263201d33573803c03a0360342036264c6403666ae71241035054350001b135573ca00226ea80044d55ce9baa00122333573466e3c00800406c06848cd400c88ccd400c88008008004d400488004c8004d5406888448894cd40044d400c88004884ccd401488008c010008ccd54c01c4800401401000448848cc00400c008448cc004894cd40084060400405448c88c008dd6000990009aa80c111999aab9f0012501a233501930043574200460066ae880080488c8c8cccd5cd19b8735573aa004900011991091980080180118051aba150023005357426ae8940088c98c8048cd5ce00980900809aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa004900011991091980080180118099aba1500233500d012357426ae8940088c98c805ccd5ce00c00b80a89aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403266ae7006806405c0580544d55cea80089baa00135742a00466a012eb8d5d09aba2500223263201333573802802602226ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355015223233335573e0044a030466a02e66442466002006004600c6aae754008c014d55cf280118021aba200301013574200224464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900819ab9c01101000e00d135573aa00226ea80048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900819ab9c01101000e00d00c00b135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900619ab9c00d00c00a135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8028cd5ce00580500409baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c804ccd5ce00a00980880800780700680600589aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401866ae700340300280244d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200933573801401200e00c26aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401466ae7002c02802001c0184d55cea80089baa0012323333573466e1d40052002200a23333573466e1d40092000200a23263200633573800e00c00800626aae74dd5000a4c24002921035054310032001355006222533500110022213500222330073330080020060010033200135500522225335001100222135002225335333573466e1c005200000a0091333008007006003133300800733500b1233300100800300200600312200212200111220021221223300100400311232300100122330033002002001335122335122330023300448920414c7592c420da58e7e1ee01272bbe6c8f424f74f63bf56ced7ce6eba1e8b88000480012210b636f756e746572636f696e002212330010030022001221233001003002200101"
    };

const mintingpolicyscriptaddress = lucid.utils.validatorToAddress(mintingPolicyScript);

console.log ("Minting policy validator address:", mintingpolicyscriptaddress);

/* const tx = await lucid.newTx()
    .payToContract(mintingpolicyscriptaddress,{ inline: Data.to(100n) },{lovelace:5000000n})
    .complete();

const signedTx = await tx.sign().complete();
const submitTx = await signedTx.submit();

console.log ("Txhash of locked ada:",submitTx);

const policyId = lucid.utils.mintingPolicyToId(mintingPolicyScript);

console.log("Policy id",policyId);

const mintfunc : TxHash =  async function mint(
    name: string,
  ): Promise<TxHash> {
    const unit: Unit = policyId + fromText(name);
  
    const tx = await lucid
      .newTx()
      .mintAssets({ [unit]: 1n }, fromText("Minting"))
      .attachMintingPolicy(mintingPolicyScript)
      .complete();
  
    const signedTx = await tx.sign().complete();
  
    const txHash = await signedTx.submit();
    
    return txHash;
    //console.log("Tx hash of mint func:",txHash);

  }

  console.log("Tx hash of mint func:",mintfunc);
  //await mint(fromText("coin"));

  //emulator.awaitBlock(4);

   try {
    await mint(fromText("coin"));
    assert(
      false,
      "The transactions should have failed because of exceeding slot range.",
    );
  } catch (_e) {
    assert(true);
  }
;
  
 //console.log("Mint Function", await mint(fromText("coin"))); */
