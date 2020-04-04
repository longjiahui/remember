const {route, param} = require('koa-serve-decorator');
const {collections, jwtSecret, ret} = require('../config');
const {user: userCollection} = collections;
const jwt = require("jsonwebtoken");


const usernameType = {and: ['string', val=>val.length>4 && val.length < 20]};
const passwordType = {and: ['string', val=>val.length>6 && val.length < 20]};
const userType = {
    username: usernameType,
    password: passwordType
}

@route('/user')
class UserController{

    @route('/register')
    @param(userType)
    async register(ctx, next){
        let {username, password} = ctx.request.body;
        await ctx.db.collection(userCollection).insertOne({username, password});
        ctx.body = ret.SUCCEED();
        await next();
    }

    @route('/login')
    @param(userType)
    async login(ctx, next){
        let {username, password} = ctx.request.body;
        //verify username and password
        let user = await ctx.userService.checkPassword(username, password);
        if(!user){
            ctx.body = ctx.errorService.error('User name and password do not match');
        }else{
            let token = jwt.sign(username, jwtSecret);
            ctx.body = ret.SUCCEED({
                token,
                user
            });
        }
        await next();
    }
}