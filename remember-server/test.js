const NodeRSA = require('node-rsa');

let key = new NodeRSA();
key.generateKeyPair();
console.log(key.exportKey('pkcs8'));
console.log(key.exportKey('pkcs8-public'));