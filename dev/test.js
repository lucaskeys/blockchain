const Blockchain = require('./blockchain')

const bitcoin = new Blockchain();

bitcoin.createNewBlock(3212, 'DSKJAS3SDFSDJKFH32', 'KFJDSH23KLJ');
bitcoin.createNewBlock(122, 'FDESKFJLAKJ4343', 'SDKLJ45WQDJLK');
bitcoin.createNewBlock(9854, '324FE00DS325', '342KJFLJKSS');

console.log(bitcoin.getLastBlock())

console.log(bitcoin)
