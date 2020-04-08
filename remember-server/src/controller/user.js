const {route, param} = require('koa-serve-decorator');
const {collections, jwtSecret, ret, key} = require('../config');
const {user: userCollection} = collections;
const jwt = require("jsonwebtoken");


const usernameType = {and: ['string', val=>val.length>6 && val.length < 20]};
const passwordType = 'truthyString';
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
        password = ctx.keyService.decrypt(password);
        await ctx.db.collection(userCollection).insertOne({username, password});
        let token = jwt.sign(username, jwtSecret);
        ctx.body = ret.SUCCEED({
            token
        });
        await next();
    }

    @route('/login')
    @param(userType)
    async login(ctx, next){
        let {username, password} = ctx.request.body;
        password = ctx.keyService.decrypt(password);
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

    @route('/check')
    async check(ctx, next){
        let {username} = ctx.request.body;
        ctx.body = ret.SUCCEED({
            exist: await ctx.userService.checkUsernameExist(username), 
        });
        await next();
    }
}