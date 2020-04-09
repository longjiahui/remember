const {service} = require('koa-serve-decorator');
const {key, jwtSecret} = require('../config');
const jwt = require('jsonwebtoken');

@service
class KeyService{
    // rsa decrypt
    decrypt(data){
        return key.decrypt(data, 'utf8');
    }

    // jwt token
    jwtSign(data, options = {}){
        return jwt.sign(data, jwtSecret, options);
    }
    jwtDecode(data, options = {}){
        return jwt.decode(data, jwtSecret, options);
    }
}