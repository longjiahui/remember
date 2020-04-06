let compose = require('koa-compose');
let log4js = require('log4js');
let config = require('./config');
let {errno} = require('koa-serve-decorator');

log4js.configure('./log4js.json');
log4js.level = 'INFO';
let accessLog = log4js.getLogger('access');

//log
module.exports = compose([ async (ctx, next) => {
    ctx.logger = log4js.getLogger();
    const start = Date.now();
    try{
        await next();
    }catch(err){
        if(err){
            if(err.code === errno.ERR_VERIFY_ERROR || err.code === errno.ERR_NOTOKEN){
                ctx.logger.error('logincheck failed:\n', err.msg);
                err = config.ret.ERR_UNLOGIN;
            }
            if(err.code === errno.ERR_ARG){
                ctx.logger.error('arg check failed:\n', err.msg);
                err = config.ret.ERR_ARG;
            }

            //错误处理如日志处理
            if(err.code){
                //过滤已知的错误返回
                ctx.logger.debug(err);
                ctx.body = err;
            }else{
                if(err.name === 'MongoError'){
                    //数据库错误
                    ctx.logger.error('database error:\n', err);
                    ctx.body = config.ret.ERR_DB;
                }else{
                    //错误未知...
                    ctx.logger.error('error unknown:\n', err);
                    ctx.body = config.ret.ERR_UNKNOWN;
                }
            }
        }else{
            //错误未知...
            ctx.logger.error('error unknown:\n', err);
            ctx.body = config.ret.ERR_UNKNOWN;
        }
    }
    const ms = Date.now() - start;
    accessLog.trace(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`);
    accessLog.trace(`-----------------`);
}, async (ctx,next)=>{
    //输出post body的日志
    if(ctx.request.body){
        ctx.logger.debug('post body:', JSON.stringify(ctx.request.body));
    }
    //记录query参数
    if(Object.keys(ctx.query).length > 0){
        ctx.logger.debug('query params:', JSON.stringify(ctx.query));
    }
    await next();
}]);
