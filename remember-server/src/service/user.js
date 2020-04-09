const {collections} = require('../config');
const userCollection = collections.user;
const {service} = require('koa-serve-decorator');
const ObjectId = require('mongodb').ObjectId;

@service
class UserService{

    _collection(){
        return this.ctx.db.collection(userCollection);
    }

    getUsername(){
        return this.ctx.request.loginInfo.username;
    }

    async getUser({_id, username}){
        if(_id){
            return await this._collection().findOne({_id: ObjectId(_id)}, {projection: {password: 0}});
        }else if(username){
            return await this._collection().findOne({username}, {projection: {password: 0}});
        }
    }

    async checkUsernameExist(username){
        return !!await this._collection().findOne({username});
    }

    /**
     * @method checkPassword
     * @for UserService
     * @param {string} username user name
     * @param {string} password password
     * @return {boolean|Object} user info when pass, or else falsy
     */
    async checkPassword(username, password){
        return await this._collection().findOne({username, password}, {projection:{password: 0}});
    }

    async getSetting(username){
        let user = await this.getUser({username});
        if(user && user.setting){
            return user.setting;
        }else{
            return {};
        }
    }

    async saveSetting(username, setting){
        let originSetting = await this.getSetting(username);
        setting = {
            ...originSetting,
            ...setting
        }
        return await this._collection().updateOne({username}, {$set: {setting}});
    }
}