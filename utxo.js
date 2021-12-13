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
            sum -= +entry.utxoEntry.amount
        })

        console.log("UTXO BALANCE:", sum);
    })
}

function buildBalance({entries}){
    //console.log("entries", entries)
    entries.map(entry=>{
        sum += +entry.utxoEntry.amount;
    })

    console.log("UTXO BALANCE:", sum);

    if(doSubscribe)
        subscribe()
    else{
        rpc.disconnect();
    }
}
