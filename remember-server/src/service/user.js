const {collections} = require('../config');
const userCollection = collections.user;
const {service} = require('koa-serve-decorator');
const ObjectId = require('mongodb').ObjectId;

@service
class UserService{

    async getUser({_id, username}){
        if(_id){
            return await this.ctx.db.collection(userCollection).findOne({_id: ObjectId(_id)}, {projection: {password: 0}});
        }else if(username){
            return await this.ctx.db.collection(userCollection).findOne({username}, {projection: {password: 0}});
        }
    }

    async checkUsernameExist(username){
        return !!await this.ctx.db.collection(userCollection).findOne({username});
    }

    /**
     * @method checkPassword
     * @for UserService
     * @param {string} username user name
     * @param {string} password password
     * @return {boolean|Object} user info when pass, or else falsy
     */
    async checkPassword(username, password){
        return await this.ctx.db.collection(userCollection).findOne({username, password}, {projection:{password: 0}});
    }
}