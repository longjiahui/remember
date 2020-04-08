const {service} = require('koa-serve-decorator');
const {key} = require('../config');

@service
class KeyService{
    decrypt(data){
        return key.decrypt(data, 'utf8');
    }
}