function Blockchain() {
  this.chain = [];
  // All blocks that will be mined will be stored in a chain
  this.newTransactions = []
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    // where in the chain is this at
    index: this.chain.length + 1,
    timeStamp: Date.now(),
    transactions: this.newTransactions,
    // the nonce is proof that we created this block in a legit way using PoW
    nonce: nonce,
    // this hash will be the data from our new block
    hash: hash
  }
}