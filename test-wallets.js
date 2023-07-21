#!/usr/bin/env node
const { RPC } = require('@kaspa/grpc-node');
const { Wallet, initKaspaFramework, kaspacore, Storage } = require('@kaspa/wallet');
const utils = require('@aspectron/flow-utils');
let host = "127.0.0.1:16110";
const storage = new Storage({logLevel:'debug'});

let args = utils.args();

if(args.help){
    console.log("uses:  \n./info --host='127.0.0.1:16110' ")
    process.exit(0);
}

if(args.host){
    host = args.host
}


const run = async ()=>{
    await initKaspaFramework();
    
    // const rpc = new RPC({
    //     clientConfig:{
    //         host,
    //         reconnect : false,
    //         verbose : false,
    //         disableConnectionCheck : false
    //     }
    // });
    //xprv9s21ZrQH143K4DoTUWmhygbsRQjAn1amZFxKpKtDtxabRpm9buGS5bbU4GuYDp7FtdReX5VbdGgoWwS7RuyWkV6aqYQUW6cX5McxWE8MN57
    //kaspa:qpr7hwkgxusy2ps2v6t5kzdye32zzpd8uc02rm58eq388ug8n9gdxe6rft95n
    //let seeds = "genre dutch tiger food exclude pull village derive sort whisper put enjoy";
    
    //let seeds = "rookie maple ugly nasty drift staff mandate submit salute before cigar toilet";
    //let seeds =   "tobacco waste harvest wage evil kit engage bubble sphere tooth item symbol";
    
    // let wallet = Wallet.fromMnemonic(seeds, {
    //     network:"kaspa",
    //     rpc
    // }, {
    //     syncOnce:true,
    //     updateTxTimes:false,
    //     skipSyncBalance: true
    // });
    //let xkey = "xprv9s21ZrQH143K3knsajkUfEx2ZVqX9iGm188iNqYL32yMVuMEFmNHudgmYmdU4NaNNKisDaGwV1kSGAagNyyGTTCpe1ysw6so31sx3PUCDCt";
    //let mnemonic = "fortune drive couch want task keep flee term above popular head release";
    //let wallet = new Wallet(xkey, mnemonic, {network:"kaspa"});
    let wallet = new Wallet(false, false, {network:"kaspa"});

    console.log("wallet mnemonic:", wallet.mnemonic)
    console.log("wallet xkey:", wallet.HDWallet.toString())

    let count = 100;
    console.log(`creating ${count} addresses...`)
    let start = Date.now();
    let changeAddress = [];
    let receiveAddress = [];
    for(let i=0; i<count; i++){
        if (i%10 == 0){
            console.log("index:", i);
        }

        receiveAddress.push(wallet.addressManager.receiveAddress.next());
        changeAddress.push(wallet.addressManager.changeAddress.next());
    }

    let finished = Date.now();
    console.log(`time taken ${(finished-start)/1000}sec`)

   
    //console.log("receiveAddress", receiveAddress);
    //console.log("changeAddress", changeAddress);

    //for rust test

    console.log(`
    fn gen0_receive_addresses() -> Vec<&'static str> {
        vec!${JSON.stringify(receiveAddress, null, "\t")}
    }

    fn gen0_change_addresses() -> Vec<&'static str> {
        vec!${JSON.stringify(changeAddress, null, "\t")}
    }
    
    `)
}

run();