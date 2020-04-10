const {route, param, loginCheck} = require('koa-serve-decorator');
const {ret, defaultLevel} = require('../config');

@loginCheck
@route('/knowledge')
class KnowledgeController{

    @route('/save')
    @param({
        '_id?': 'truthyString',
        'categories?': 'string?',
        content: 'truthyString',
        'level?': 'number?',
    })
    async save(ctx, next){
        let {categories, content, _id, level} = ctx.request.body;
        categories = ctx.utils.stringToArray(categories);
        if(!level || level < 0){
            let user = ctx.userService.getUser({username: ctx.userService.getUsername()});
            level = user.level;
            if(!level){
                level = defaultLevel;
            }
        }
        let knowledge;
        if(!_id){
            knowledge = {
                categories, content,
                username: ctx.userService.getUsername(),
                date_create: Date.now(),
                level,
                c_level: 0,
                _next_date: ctx.knowledgeService.getNextDate(Date.now(), 1)
            };
        }else{
            knowledge = {
                categories, content, _id
            };
        }
        let res = await ctx.knowledgeService.upsertKnowledge(knowledge);
        res.categories = ctx.utils.arrayToString(res.categories);
        ctx.body = ret.SUCCEED(res);
        await next();
    }

    @route('/delete')
    @param({
        '_ids': 'truthyString',
    })
    async delete(ctx, next){
        let {_ids} = ctx.request.body;
        _ids = ctx.utils.stringToArray(_ids);
        await ctx.knowledgeService.delete(_ids);
        ctx.body = ret.SUCCEED();
        await next();
    }

    @route('/pagination')
    @param({
        'no?': 'number',
        'size?': 'number',
        'review?': 'boolean',
    })
    async pagination(ctx, next){
        let {no, size, review} = ctx.request.body;
        let condition = {};
        if(review){
            condition = {
                _next_date: {
                    $lt: Date.now()
                }
            }
        }
        let data = await ctx.knowledgeService.pagination(no, size, condition);
        data.data = data.data.map(item=>{
            item.categories = ctx.utils.arrayToString(item.categories);
            return item;
        });
        ctx.body = ret.SUCCEED(data);
        await next();
    }

    @route('/review')
    @param({
        _id: 'truthyString'
    })
    async review(ctx, next){
        let {_id} = ctx.request.body;
        await ctx.knowledgeService.review(_id);
        ctx.body = ret.SUCCEED();
        await next();
    }
}