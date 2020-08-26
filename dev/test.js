const Blockchain = require('./blockchain')

const bitcoin = new Blockchain();

bitcoin.createNewBlock(4323, '2425DFSFW24FW', '324KJDSF90S')
bitcoin.createNewTransaction(0.0321, 'SEND19da923fdWkDFKJ9n', 'RECEP19jfdk9JHFDS9')

console.log(bitcoin)
