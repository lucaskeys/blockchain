const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')

const bitcoin = new Blockchain();
// if request comes in with JSON data, parse the data and access in any of these routes
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
 
app.get('/blockchain', function (req, res) {
  res.send(bitcoin)
})

app.post('/transaction', function(req, res) {
  console.log(req.body)
  const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
  res.json({note: `Transaction will be added in block ${blockIndex}`})

})

app.get('/mine', function(res) {
  const lastBlock = bitcoin.getLastBlock;
  const prevBlockHash = lastBlock['hash']
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  };

  // to create a new block, we need the nonce, currentHash, and prev block hash
  const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData)
  const currentBlockHash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce);

  // trans action made from address "00" is a block reward and this needs to be sent to whoever mined it - sending it to current node - this entire API is a network node and will have multiple instances of the API and will act as different nodes
  bitcoin.createNewTransaction(12.5, "00");

  const newBlock = bitcoin.createNewBlock(nonce, prevBlockHash, currentBlockHash)
  res.json({
    note: "New block mined successfully",
    block: newBlock
  })
})
 
app.listen(3000, function() {
  console.log('Listening on port 3000')
})