#!/usr/bin/env node

const { exec } = require('child_process');
const path = require("path");

let address = "kaspa:qqt8ak26n702ts6q9g5u3z0actt7xj0usjsw44ffne0snu9a6ce9xynwdyr46";


let cmd = `./kaspa-rpc.js getUtxosByAddresses --addresses=[\'"${address}"\']`

const cwd = path.join(__dirname, "node_modules/@kaspa/wallet-cli");
//console.log("cwd:", cwd)
//console.log("command\n", cmd);

exec(cmd, {cwd}, (err, stdout, stderr) => {
    //console.log("stdout", err, stdout)
    if (err || stderr) {
        console.log(err || stderr);
        return;
    }
    //console.log("stdout", stdout)
    let entries = JSON.parse(stdout).entries;
    //console.log(entries);
    buildBalance(entries)
});

function buildBalance(entries){
    let sum = 0;
    entries.map(entry=>{
        sum += entry.amount;
    })

    console.log("UTXO BALANCE:", sum);
}
