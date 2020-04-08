const {route} = require('koa-serve-decorator');
const {publicKey, ret} = require('../config');

@route('/key')
class KeyController{
    @route('/get')
    async get(ctx, next){
        ctx.body = ret.SUCCEED(publicKey);
        await next();
    }
}