const Blockchain = require('./blockchain')

const bitcoin = new Blockchain();

const previousBlockHash = 'KHDFS98SFKJN8Y8';
const currentBlockData = [
  {amount: .10, sender: 'ODSIFU0934N', recipient: 'IU34ER5KLULKJ'},
  {amount: .4310, sender: 'SGDFDPOI', recipient: 'KJHFDLK'},
  {amount: .000950438, sender: '435LKJ', recipient: '543LKOVFIJ'}
];


// bitcoin.createNewBlock(4323, '2425DFSFW24FW', '324KJDSF90S')
// bitcoin.createNewTransaction(0.0321, 'SEND19da923fdWkDFKJ9n', 'RECEP19jfdk9JHFDS9')

// //  Creating a new block - then checking the previous block transactions 
// bitcoin.createNewBlock(9230, 'EFWRLN4', '4LKDFLK0')
// bitcoin.createNewTransaction(0.0034, 'SEND29da923fdWkDFKJ9n', 'RECEP2wkjwhKJHHFDS9')
// bitcoin.createNewTransaction(0.5421, 'SEND39da923fdWkDFKJ9n', 'RECEP3000Xx987')
// bitcoin.createNewTransaction(0.12, 'SEND49da923fdWkDFKJ9n', 'RECEP4LKJDFS9')
// console.log(bitcoin)
// console.log(bitcoin.chain[1].transactions)

// bitcoin.createNewBlock(20938, 'KHJEW890DUU32NLK', 'SOFIU32HJC09U')
// console.log(bitcoin.chain[2])

// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 7391));

console.log(bitcoin)