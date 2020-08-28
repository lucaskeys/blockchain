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

})
 
app.listen(3000, function() {
  console.log('Listening on port 3000')
})