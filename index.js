import { Web3, HttpProvider } from 'web3';
import SHA256 from 'crypto-js/sha256.js';

const web3 = new Web3('https://sepolia.infura.io/v3/aa2e190113aa496b99adffb034d183b6');
const blockData = await web3.eth.getBlock(
    7037713
);
let tran = blockData.transactions;

function hash(data) {
    return SHA256(data).toString();
}
function merkletree(transactions){
    if(transactions.length==1){
        return transactions[0];
    }
    if(transactions.length%2!=0){
        transactions.push(transactions[transactions.length-1]);
    }
    let newlayer =[];
    for(let i=0;i<transactions.length;i+=2){
        newlayer.push(hash(transactions[i]+transactions[i+1]));
    }
    return merkletree(newlayer);
}

console.log(merkletree(tran));