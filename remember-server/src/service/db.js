const {service} = require('koa-serve-decorator');
const {collections} = require('../config');
const ObjectId = require('mongodb').ObjectId;

@service
class DbService{
    async upsert(collection, data){
        //id, title, content
        let {_id} = data;
        if(_id){
            delete data._id;
            await this.ctx.db.collection(collection).updateOne({_id: ObjectId(_id)}, {'$set': data});
            data._id = _id;
        }else{
            let {insertedId} = await this.ctx.db.collection(collection).insertOne(data);
            data._id = insertedId;
        }
        return data;
    }
    async pagination({collection, no, size, sort = {}, condition = {}}){
        let cursor = await this.ctx.db.collection(collection).find(condition).sort(sort);
        let data = null;
        if(!no || !size || +no ===NaN || +size === NaN){
            no = 1;
            //默认20
            size = 20;
        }else{
            no = +no;
            size = +size;
        }
        let datas = await Promise.all([cursor.skip((no-1) * size).limit(size).toArray(), cursor.count()]);
        return {
            data: datas[0],
            total: datas[1]
        };
    }
}