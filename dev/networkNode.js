const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
const { v4: uuidv4 } = require('uuid');
// creates a unique random string and use as this node address - cannot have two nodes with the same address

// refers to the command to run the server
const port = process.argv[2];

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
//First step - register new url on a node and broadcast node to the entire network
app.post('/register-and-broadcast-node', function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;

})
// register a node with the network - register node will trigger it registering it to other nodes, but dont need to broadcast data
app.post('/register-node', function(req, res) {


})
// register the rest of the url/nodes that are already present on the new node thats being added so all are part of network
// register multiple nodes at once
app.post('/register-nodes-bulk', function(res, req) {

})
 
app.listen(port, function() {
  console.log(`Listening on port ${port}...`)
})