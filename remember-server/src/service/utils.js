const {service} = require('koa-serve-decorator');

@service
class Utils{
    stringToArray(str){
        let arr = [];
        if(str && typeof str === 'string'){
            arr = str.split(',');
            arr = arr.map(val=>val.trim());
        }
        return arr;
    }
    arrayToString(arr, split = ','){
        if(arr && arr instanceof Array){
            return arr.join(split);
        }
        return '';
    }
}