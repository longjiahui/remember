
const NodeRSA = require('node-rsa');

//生成公私钥对
let key = new NodeRSA();
key.generateKeyPair();
// let privateKey = key.exportKey('pkcs8');
let publicKey = key.exportKey('pkcs8-public');


module.exports = {
	jwtSecret: 'secret',
	key,
	publicKey,
	// db
	mongodb:{
		host: `${process.env.DB_HOST || 'localhost'}`,
		port: 27017,
		db: 'remember',
		max: 100,
		min: 1,
    },
    
    //table
    collections: {
		user: 'user',
		knowledge: 'knowledge',
	},

	//默认记忆等级
	defaultLevel: 5,
	
	// 返回表示
	ret: {
        SUCCEED: (data) =>{
            return {
                code:0,
                data: data
            }
        },
		ERR_ARG: {
			code:-1,
			msg:'参数错误'
		},
		ERR_BUSINESS: (msg, code)=>{
			return {
				code,
				msg
			}
		},
		ERR_UNLOGIN:{
			code:-1001,
			msg:'尚未登陆'
		},
        ERR_DB: {
            code:-301,
            msg:'程序错误'/*数据库错误不需要告诉用户*/
        },
        ERR_UNKNOWN: {
            code:-999,
            msg:'程序错误'/*未知错误不需要告诉用户*/
        }
	},
}