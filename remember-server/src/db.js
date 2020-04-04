let compose = require('koa-compose');
let config = require('./config');

module.exports = compose([require('koa-mongo')(config.mongodb), async (ctx, next) =>{
	ctx.db = await ctx.mongo.db(config.mongodb.db);
	await next();
}]);