#!/usr/bin/env node
const { RPC } = require('@kaspa/grpc-node');
const host = "127.0.0.1:16110";

const rpc = new RPC({
    clientConfig:{
        host,
        reconnect : false,
        verbose : false,
        disableConnectionCheck : false
    }
});


let sum = 0;
let addresses = ["kaspa:qqt8ak26n702ts6q9g5u3z0actt7xj0usjsw44ffne0snu9a6ce9xynwdyr46"];

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
    //let cmd = `./kaspa-rpc.js --subscribe notifyUtxosChanged --addresses=[\'"${address}"\']`
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

    subscribe()
}
