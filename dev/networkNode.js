const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
const { v4: uuidv4 } = require('uuid');
const rp = require('request-promise')
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
  // taking node url and registering it with current url
  const newNodeUrl = req.body.newNodeUrl;
  if(bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  const regNodesPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    /// 'register node endpoint'
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: {newNodeUrl: newNodeUrl},
      json: true
    }
    // this is allowing it to be asynchronous with the rp library
    regNodesPromises.push(rp(requestOptions)) 
  })
  Promise.all(regNodesPromises).then(data => {
     const bulkRegisterOptions = {
       uri: newNodeUrl + '/register-nodes-bulk',
       method: 'POST',
       body: {allNetWorkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
       json: true
     };
     return rp(bulkRegisterOptions);
  }).then(data => { 
    res.json({
      note: 'New node registered with the network successfully!'
    })
  })
})
// register a node with the network - register node will trigger it registering it to other nodes, but dont need to broadcast data
app.post('/register-node', function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const notPresentNode = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if(notPresentNode && notCurrentNode)  {
    bitcoin.networkNodes.push(newNodeUrl)
  }
  res.json({note: 'new node registered successfully with node'})
})
// register the rest of the url/nodes that are already present on the new node thats being added so all are part of network
// register multiple nodes at once 
app.post('/register-nodes-bulk', function(res, req) {
  const allNetworkNodes = req.body.allNetWorkNodes
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl
    if(nodeNotPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl)
  })
  res.json({note: 'Bulk registration successful'})
})
 
app.listen(port, function() {
  console.log(`Listening on port ${port}...`)
})