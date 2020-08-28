const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
const { v4: uuidv4 } = require('uuid');
// creates a unique random string and use as this node address - cannot have two nodes with the same address

const nodeAddress = uuidv4().split('-').join('')

const bitcoin = new Blockchain();
// if request comes in with JSON data, parse the data and access in any of these routes
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
 
app.get('/blockchain', function (req, res) {
  res.send(bitcoin)
})

app.post('/transaction', function(req, res) {
  const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
  res.json({note: `Transaction will be added in block ${blockIndex}`})

})

app.get('/mine', function(req, res) {
  const lastBlock = bitcoin.getLastBlock()
  const previousBlockHash = lastBlock['hash']
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  };
  console.log(nodeAddress)
  // to create a new block, we need the nonce, currentHash, and prev block hash - so we are doing a proof of work - necessary to get info above to create block
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)
  const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  // trans action made from address "00" is a block reward and this needs to be sent to whoever mined it - sending it to current node - this entire API is a network node and will have multiple instances of the API and will act as different nodes
  bitcoin.createNewTransaction(12.5, "00", nodeAddress);

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
  
  res.json({
    note: "New block mined successfully",
    block: newBlock
  })
})
 
app.listen(3000, function() {
  console.log('Listening on port 3000')
})