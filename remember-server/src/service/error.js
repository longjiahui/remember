const {service, beforeRoute} = require('koa-serve-decorator');

@service
class ErrorService{

    @beforeRoute
    init(){
        this.count = -500;
    }

    errno(){
        return this.count--;
    }

    error(msg){
        return {
            code: this.errno(),
            msg,
        }
    }
}