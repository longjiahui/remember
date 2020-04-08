<template>
    <div class="login">
        <transition name="fade" mode="out-in">
            <div v-if="publicKey">
                <transition name="slide-fade" mode="out-in" appear @after-enter="handleStateSwitch">
                    <div key="username" v-if="!passwordState" class="input-group">
                        <h1 style="margin-bottom: 20px">Step1: 输入登录用户名</h1>
                        <div :class="`input-group-content container-column${username && (!nameExist || usernameWrong)?' with-error':''}`">
                            <input autofocus ref="usernameInput" @keyup.enter="handleClickEnter" placeholder="用户名" v-model="username" @input="handleInputUsername" type="text" class="input input-large">
                            <div @click="handleClickEnter" class="button button-large btn-yes"><i class="iconfont icon-enter"></i></div>
                        </div>
                        <transition name="fade">
                            <div @click="passwordState = true" class="input-info go-register" v-if="username && !usernameWrong && !nameExist">用户名 <span style="font-weight: bold">{{username}}</span> 未注册，点击前往注册</div>
                            <div v-if="username && usernameWrong" class="input-info go-register">用户名长度必须为7-20个字符</div>
                        </transition>
                    </div>
                    <div key="password" v-else class="input-group">
                        <div @click="handleBack" class="back-username-input"><span style="font-weight: bold">{{username}} : </span>返回</div>
                        <div :class="`input-group-content container-column${password && passwordWrong?' with-error':''}`">
                            <input ref="passwordInput" @input="handleInputPassword" @keyup.enter="handleClickEnter" placeholder="密码" v-model="password" type="password" class="input input-large">
                            <div @click="handleClickEnter" class="button button-large btn-yes"><i class="iconfont icon-enter"></i></div>
                            <transition name="fade">
                                <div v-if="!nameExist && passwordWrong" class="input-info go-register">密码长度必须为7-20个字符</div>
                            </transition>
                        </div>
                    </div>
                </transition>
            </div>
            <div v-else>
                <transition name="fade" mode="out-in">
                    <h1 key="0" v-if="loadingPublicKey">加载中</h1>
                    <h1 key="1" v-else>加载失败，请刷新页面</h1>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script>
import validator from '@/assets/script/validator';
import NodeRSA from 'node-rsa';

export default {
    data(){
        return {
            timeoutInstance: null,
            passwordTimeoutInstance: null,
            username: '',
            nameExist: true,
            passwordState: false,
            password: '',
            passwordWrong: false,
            usernameWrong: false,
            publicKey: '',
            loadingPublicKey: true,
        }
    },
    computed:{
        passwordEncryted(){
            return this.publicKey.encrypt(this.password, 'base64');
        }
    },
    created(){
        let username = localStorage.getItem('username');
        if(username){
            this.username = username;
            this.passwordState = true;
        }
        this.$api.key.get().then(key=>{
            this.publicKey = new NodeRSA();
            this.publicKey.importKey(key, 'pkcs8-public-pem');
        }).finally(()=>{
            this.loadingPublicKey = false;
        });
    },
    methods: {
        handleInputPassword(e){
            this.passwordWrong = false;
            if(this.passwordTimeoutInstance){
                clearTimeout(this.passwordTimeoutInstance);
                this.passwordTimeoutInstance = null;
            }
            if(e.target.value){
                this.passwordTimeoutInstance = setTimeout(()=>{
                    //check password
                    this.checkPassword(e.target.value);
                }, 1000);
            }
        },
        checkPassword(password){
            let promise = validator.validate(password, 'passwordType');
            promise.catch(err=>{
                this.passwordWrong = true;
            });
            return promise;
        },
        handleStateSwitch(){
            if(this.$refs.passwordInput){
                this.$refs.passwordInput.focus();
            }
            if(this.$refs.usernameInput){
                this.$refs.usernameInput.focus();
            }
        },
        handleBack(){
            this.passwordState = false;
            this.password = '';
            this.passwordWrong = false;
            localStorage.removeItem('username');
        },
        checkUsername(username){
            if(this.timeoutInstance){
                clearTimeout(this.timeoutInstance);
                this.timeoutInstance = null;
            }
            return validator.validate(username, 'usernameType').then(()=>{
                return this.$api.user.check(username).then(({exist})=>{
                    this.nameExist = exist;
                    return exist;
                });
            }).catch(err=>{
                this.usernameWrong = true;
            });
        },
        handleInputUsername(e){
            this.usernameWrong = false;
            this.nameExist = true;
            if(this.timeoutInstance){
                clearTimeout(this.timeoutInstance);
                this.timeoutInstance = null;
            }
            if(e.target.value){
                this.timeoutInstance = setTimeout(()=>{
                    //check username
                    this.checkUsername(this.username);
                }, 1000);
            }
        },
        handleClickEnter(){
            if(!this.passwordState){
                this.checkUsername(this.username).then(exist=>{
                    if(exist){
                        this.passwordState = true;
                    }
                });
            }else{
                if(this.nameExist){
                    //login
                    this.$api.user.login(this.username, this.passwordEncryted).then(token=>{
                        localStorage.setItem('token', token);
                        localStorage.setItem('username', this.username);
                        this.$router.push('/console');
                    }).catch(res=>{
                        console.error(res);
                        this.passwordWrong = true;
                    });
                }else{
                    //register
                    if(this.passwordTimeoutInstance){
                        clearTimeout(this.passwordTimeoutInstance);
                        this.passwordTimeoutInstance = null;
                    }
                    this.checkPassword(this.password).then(()=>{
                        this.$api.user.register(this.username, this.passwordEncryted).then(token=>{
                            localStorage.setItem('token', token);
                            localStorage.setItem('username', this.username);
                            this.$router.push('/console');
                        }).catch(res=>{
                            console.error(res);
                            this.passwordWrong = true;
                        });
                    });
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.login{
    font-size: var(--fsL);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 50px));
}
.clickable{
    background: white;
    border-radius: 5px;
    padding: 10px;
    box-shadow: var(--shadow-light);
    transition: all var(--speed-fast);

    &:hover{
        opacity: .7;
    }
}
.go-register{
    .clickable;
}
.input-info{
    position: absolute;
    bottom: 0;
    transform: translate(0, calc(100% + 15px));
    cursor: pointer;
}
.back-username-input{
    position: absolute;
    top: 0;
    transform: translate(0, calc(-100% - 15px));
    cursor: pointer;
    white-space: nowrap;
    .clickable;
}
.input-group-content{
    border-radius: 5px;
    overflow: hidden;
    box-shadow: var(--shadow-light);
    transition: box-shadow var(--speed-slow);

    &.with-error{
        box-shadow: var(--shadow-error);
    }
}
.input-group{
    position: relative;
    
}
.error-msg{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    transition: width var(--speed-fast);
}
.btn-yes{
    position: relative;
    color: #999;
    transition: color var(--speed-fast);
    &::after{
        content: '';
        position: absolute;
        height: 60%;
        width: 1px;
        background: whitesmoke;
        top: 20%;
        left: 0;
    }
    &:hover{
        color: #333;
    }
}
</style>