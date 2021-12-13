#!/usr/bin/env node
const { RPC } = require('@kaspa/grpc-node');
const utils = require('@aspectron/flow-utils');
let host = "127.0.0.1:16110";
let addresses = ["kaspa:xxxxxx"]
let doSubscribe = false;

let args = utils.args();

if(args.help){
    console.log("uses:  \n./utxo --host='127.0.0.1:16110' --address='kaspa:xxxxxx' --subscribe ")
    process.exit(0);
}

if(args.host){
    host = args.host
}

if(args.address){
    addresses = [args.address]
}

if(args.subscribe){
    doSubscribe = true
}

let format;
if(typeof Intl != "undefined"){
    let intInfo = Intl.DateTimeFormat().resolvedOptions();
    let locale_ = intInfo.locale || 'en-US';
    if(intInfo.timeZone.toLowerCase() == 'asia/calcutta'){
        locale_ = 'en-IN';
    }

    format = (number)=>{
        return new Intl.NumberFormat(locale_, {
            style: 'currency',
            currency: 'KAS'
        }).format(number/1e8)
    }
}else{
    format = (number)=>{
        return number/1e8
    }
}


const rpc = new RPC({
    clientConfig:{
        host,
        reconnect : false,
        verbose : false,
        disableConnectionCheck : false
    }
});


let sum = 0;

//console.log("rpc", rpc.client.isConnected)
rpc.onConnect(()=>{
    //console.log("onConnect")
    rpc.getUtxosByAddresses(addresses)
    .then(buildBalance)
    .catch(err=>{
        console.log("getUtxosByAddresses:error", err)
    })
})

function subscribe(){
    rpc.subscribeUtxosChanged(addresses, ({added, removed})=>{
        console.log("data", added, removed)
        added.map(entry=>{
            sum += +entry.utxoEntry.amount
        })
        removed.map(entry=>{
            if(entry.utxoEntry)
                sum -= +entry.utxoEntry.amount
        })

        console.log("UTXO BALANCE:", format(sum));
    })
}

function buildBalance({entries}){
    //console.log("entries", entries)
    entries.map(entry=>{
        sum += +entry.utxoEntry.amount;
    })

    console.log("UTXO BALANCE:", format(sum));

    if(doSubscribe)
        subscribe()
    else{
        rpc.disconnect();
    }
}
