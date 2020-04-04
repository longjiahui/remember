const Axios = requrie('axios');
const Validator = require('validator-biang');

let axios = Axios.create({
    baseURL: 'http://localhost:3000/api/'
});

(async ()=>{
    //user login
    function login(username, password){
        return axios.post('/user/login', {username, password});
    }
    try{
        let validator = new Validator({
            res(val){
                return this.validate(val, {
                    code: 'number',
                });
            }
        });
        const res = and=>({and: ['res', and]});

        // 参数临界值
        await validator.validate(await login({username: 'unexist', password: '************'}), res(val=>{
            // if(val.code === )
        }));
        
    }catch(err){
        console.log(err);
    }
})();