const {route, param, loginCheck} = require('koa-serve-decorator');
const {collections, smtp, ret} = require('../config');
const {user: userCollection} = collections;


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
        let token = ctx.keyService.jwtSign({username}, {expiresIn: '7d'});
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
            throw ctx.errorService.error('User name and password do not match');
        }else{
            let token = ctx.keyService.jwtSign({username}, {expiresIn: '7d'});
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

    @route('/setting/get')
    @loginCheck
    async getSetting(ctx, next){
        let username = ctx.userService.getUsername();
        ctx.body = ret.SUCCEED(await ctx.userService.getSetting(username));
        await next();
    }

    @route('/setting/save')
    @param({
        'triggerTime?': 'number?'
    })
    @loginCheck
    async saveSetting(ctx, next){
        let {triggerTime} = ctx.request.body;
        let username = ctx.userService.getUsername();
        //邮箱需要验证，此处必须剃走
        await ctx.userService.saveSetting(username, {
            triggerTime
        });
        ctx.body = ret.SUCCEED();
        await next();
    }

    @route('/setting/email/verifyrequest')
    @param({
        'email': /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/
    })
    @loginCheck
    async verifyEmail(ctx, next){
        let {email} = ctx.request.body;
        let username =ctx.userService.getUsername();
        if(email === (await ctx.userService.getSetting(username)).email){
            throw ctx.errorService.error('请不要重复验证相同的邮箱');
        }
        let token = ctx.keyService.jwtSign({
            email,
            username
        }, {
            //half hour
            expiresIn: 900,
        });
        await ctx.emailService.send(email, '验证您的邮箱', `<p>感谢您使用Remember</p><h2>请点击下面的链接验证您的邮箱</h2><a target="_blank" href="http://anfo.fun:8081/api/user/setting/email/confirm/${token}">http://anfo.fun:8081/api/user/setting/email/confirm/${token}</a>`);
        ctx.body = ret.SUCCEED();
        await next();
    }

    @route('/setting/email/confirm/:token')
    @param({
        token: 'truthyString'
    })
    async confirmEmail(ctx, next){
        console.log(ctx.request.body, ctx.params);
        let {token} = ctx.params;
        let decoded = ctx.keyService.jwtDecode(token);
        if(decoded.username && decoded.email){
            await ctx.userService.saveSetting(decoded.username, {
                email: decoded.email
            });
            ctx.body = '验证成功';
        }else{
            ctx.body = '验证失败，请重试';
        }
        await next();
    }
}