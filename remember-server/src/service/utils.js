const {service} = require('koa-serve-decorator');

//ms
const dms = 1*24*60*60*1000;

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
    getDateByLevel(begin, level){
        var d = 1;
        while(--level){
            d+=d;
        }
        return begin + d * dms;
    }
}