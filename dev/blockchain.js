const sha256 = require('sha256')
const currentNodeUrl = process.argv[3];
function Blockchain() {
  this.chain = [];
  // All blocks that will be mined will be stored in a chain
  this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl
  this.networkNodes = []
  // Creating the Genesis block
  this.createNewBlock(100, '0', '0');
};



Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    // where in the chain is this at
    index: this.chain.length + 1,
    timeStamp: Date.now(),
    transactions: this.pendingTransactions,
    // the nonce is proof that we created this block in a legit way using PoW
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  }

  this.pendingTransactions = [];
  // clear transactions to start the next block
  // Adds to chain
  this.chain.push(newBlock)
  return newBlock;
}

Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1]
  // this is the last block in the chain
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
   const newTransaction = {
     amount: amount,
     sender: sender,
     recipient: recipient
   };
   this.pendingTransactions.push(newTransaction)

  //  returning the number of the block our new tx was added to
   return this.getLastBlock()['index'] + 1
}

// takes in block from chain and hash that block into a fixed length string
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
  const hash = sha256(dataAsString);
  return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substring(0,4) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }
  return nonce;
}

module.exports = Blockchain