import axios from 'axios';
import vm from '@/main';

const _axios = axios.create({
    //default config
    baseURL: '/api',
});

let loadingInstance;
let loadingLock = {
    hold: 0,
    get(){
        if(this.hold === 0){
            loadingInstance = vm.$loading();
        }
        this.hold += 1;
    },
    release(){
        this.hold -= 1;
        if(this.hold <= 0){
            this.hold = 0;
            loadingInstance.close();
        }
    }
}

_axios.interceptors.request.use((config)=>{
    if(!config.banAutoLoading){
        loadingLock.get();        
    }
    let token = localStorage.getItem('token');
    if(token){
        config.headers.authorization = token;
    }
    return config;
}, error=>{
    return Promise.reject(error);
});

_axios.interceptors.response.use((response)=>{
    if(!response.config.banAutoLoading){
        loadingLock.release();
    }
    if(response && response.data){
        let {code} = response.data;
        if(code + '' !== '0'){
            throw response;
        }
        return response;
    }
    throw response;
}, error => {
    return Promise.reject(error);
});

_axios.error

export default (Vue)=>{
    Vue.prototype.$api = {
        user: {
            check(username){
                return _axios.post('/user/check', {
                    username
                }).then(res => res.data.data);
            },
            register(username, password){
                return _axios.post('/user/register', {
                    username,
                    password
                }).then(res=>res.data.data.token);
            },
            login(username, password){
                return _axios.post('/user/login', {
                    username,password
                }).then(res=>res.data.data.token);
            }
        },
        // article:{
        //     pagination(no, size, category){
        //         return _axios.post('/article/pagination', {
        //             no, size, category
        //         }).then(res => res.data.data);
        //     },
        //     get(_id){
        //         return _axios.post('/article/get', {
        //             _id
        //         }).then(res => res.data.data);
        //     },
        //     getAllCategories(){
        //         return _axios.post('/article/category/all', null, {
        //             autoLoading: true
        //         }).then(res => res.data.data);
        //     }
        // }
    };
}