const Koa = require('koa');
const {initAll} = require('koa-serve-decorator');
const {jwtSecret} = require('./config');
let staticCache = require('koa-static-cache');
let LRU = require('lru-cache');

let app = new Koa();

app.use(require('koa-body')({multipart:true}));

//log and error handle
app.use(require('./log'));

//koa-mongo
app.use(require('./db'));


var files = new LRU({ max: 1000 })
app.use(staticCache({
  dir: './static',
  dynamic: true,
  files: files
}));

app.use(initAll({
    dirs: [
        [`${__dirname}/controller`],
        [`${__dirname}/service`],
    ],
    route:{
        base: ['/api', 'all'],
        getToken: ctx=>ctx.headers.authorization,
        jwtSecret
    },
}));

//不命中的url全部返回index
app.use((ctx) =>{
    if(!ctx.body){
        ctx.type ='html';
        ctx.body = require('fs').createReadStream('./static/index.html');
    }
})


app.listen(3000);