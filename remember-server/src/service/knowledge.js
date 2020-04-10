const {service} = require('koa-serve-decorator');
const {collections} = require('../config');
const ObjectId = require('mongodb').ObjectId;
const knowledgeCollection = collections.knowledge;

//ms
const dms = 1*24*60*60*1000;

@service
class KnowledgeService{
    async upsertKnowledge(knowledge){
        return await this.ctx.dbService.upsert(knowledgeCollection, knowledge);
    }
    async pagination(no, size, condition){
        return await this.ctx.dbService.pagination({
            collection: knowledgeCollection,
            no,
            size,
            sort: {
                date_create: -1,
            },
            condition: {
                ...condition,
                username: this.ctx.userService.getUsername()
            }
        })
    }
    async delete(_ids){
        await this.ctx.db.collection(knowledgeCollection).deleteMany({'_id':{'$in':_ids.map((_id)=>{
            return ObjectId(_id);
        })}});
    }
    async review(_id){
        let knowledge = await this.ctx.db.collection(knowledgeCollection).findOne({_id: ObjectId(_id)});
        if(knowledge._next_date < Date.now()){
            //ok
            if(knowledge.c_level < knowledge.level){
                //ok
                knowledge.c_level+=1;
                if(knowledge.c_level === knowledge.level){
                    //done
                    knowledge.c_level = 9999;
                    knowledge._next_date = null;
                }else{
                    //兼容一下，因为可能没有_prev_date
                    if(!knowledge._prev_date){
                        knowledge._prev_date = knowledge.date_create;
                    }
                    knowledge._next_date = this.getNextDate(knowledge.c_level + 1);
                    knowledge._prev_date = Date.now();
                }
                await this.upsertKnowledge(knowledge);
            }else{
                throw this.ctx.errorService.error('该知识已经完成了');
            }
        }else{
            throw this.ctx.errorService.error('该知识不需要复习');
        }
    }
    
    getNextDate(level){
        var d = 1;
        while(level--){
            d+=d;
        }
        return Date.now() + dms * d;
    }
}