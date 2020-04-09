<template>
    <div>
        <nav class="navbar container-row row-vertical-center box">
            <div class="auto-width navbar-content">
                <div class="navbar-group container-column">
                    <router-link :class="`nav-item first-item ${$route.path==='/console/all'?'active':''}`" to="/console/all">知识库</router-link>
                    <router-link :class="`nav-item ${$route.path==='/console/review'?'active':''}`" to="/console/review">待复习</router-link>
                </div>
                <div class="navbar-group container-column">
                    <div class="nav-item" @click="settingDialogVisiable = true">设置</div>
                    <div @click="handleLogout" class="nav-item last-item"><i class="iconfont icon-log-out"></i></div>
                </div>
            </div>
        </nav>
        <el-dialog
            title="设置"
            width="400px"
            :visible.sync="settingDialogVisiable">
            <div class="setting-content" v-loading="settingLoading">
                <p>设置推送邮箱</p>
                <transition name="slide-fade" mode="out-in">
                    <div key="1" v-if="setting.email && !emailInputVisible" class="container-column column-center-vertical">
                        <div>{{setting.email}}</div>
                        <button class="button opacity-hover" @click="emailInputVisible = true">重新绑定</button>
                    </div>
                    <div key="2" v-else class="container-column mail-input-group">
                        <button class="button column-item opacity-hover" @click="emailInputVisible = false">返回</button>
                        <input :disabled="verifying" type="text" v-model="emailInput" class="input column-item-main" placeholder="example@domain">
                        <transition name="fade" mode="out-in">
                            <button key="1" @click="handleCheckVerifyState" v-if="verifying" class="button column-item opacity-hover">查看验证状态({{cd}})</button>
                            <button key="2" v-else class="button column-item opacity-hover" @click="handleVerify">验证</button>
                        </transition>
                    </div>
                </transition>
                <p>设置推送时间</p>
                <transition name='slide-fade' mode="out-in">
                    <div key="1" v-if="setting.triggerTime && !triggerTimeInputVisible" class="container-column column-center-vertical">
                        <div>{{$utils.getDayTime(new Date(setting.triggerTime))}}</div>
                        <button class="button column-item opacity-hover" @click="triggerTimeInputVisible = true">重新设置</button>
                    </div>
                    <div v-else key="2" class="container-column column-center-vertical">
                        <el-time-picker
                            arrow-control
                            v-model="setting.triggerTime"
                            placeholder="选择推送时间">
                        </el-time-picker>
                        <button class="button column-item opacity-hover" @click="handleSaveTriggerTime">保存</button>
                    </div>
                </transition>
            </div>
        </el-dialog>
        <div class="auto-width">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            emailInputVisible: false,
            settingDialogVisiable: false,
            settingLoading: false,
            verifying: false,
            verifyLock: null,
            setting: {},
            emailInput: '',
            triggerTimeInputVisible: null,
            cd: 0,
        }
    },
    watch:{
        settingDialogVisiable(visible){
            if(visible){
                this.settingLoading = true;
                this.$api.user.getSetting().then(setting=>{
                    this.settingLoading = false;
                    this.setting = setting;
                });
            }
        }
    },
    methods: {
        handleSaveTriggerTime(){
            this.$api.user.saveSetting({
                triggerTime: this.setting.triggerTime.getTime()
            }).then(()=>{
                this.triggerTimeInputVisible = false;
            });
        },
        handleCheckVerifyState(){
            this.$api.user.getSetting().then(setting=>{
                if(this.emailInput === setting.email){
                    this.email = setting.email;
                    clearInterval(this.verifyLock);
                    this.verifyLock = false;
                    this.verifying = false;
                    this.emailInputVisible = false;
                }
            });
        },
        handleVerify(){
            if(this.emailInput){
                this.$api.user.verifyEmail(this.emailInput).then(()=>{
                    this.verifying = true;
                    if(this.verifyLock){
                       clearInterval(this.verifyLock);
                       this.verifyLock = null; 
                    }
                    this.cd = 300;
                    this.verifyLock = setInterval(()=>{
                        this.cd -= 1;
                        if(this.cd <= 0){
                            this.verifying = false;
                            clearInterval(this.verifyLock);
                            this.verifyLock = false;
                        }
                    }, 1000);
                });
            }
        },
        handleLogout(){
            localStorage.removeItem('token');
            this.$router.push('/login');
        },
    }
}
</script>

<style lang="less" scoped>
@import url(~@/assets/style/variable);
@import url(~@/assets/style/function);
.navbar{
    // font-weight: bold;
    height: @largeHeight;
    border-radius: 0;
}
.navbar-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}
.navbar-group{
    height: 100%;
}
.nav-item{
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;

    transition: all .3s;
    &:hover{
        font-weight: bold;
        background: whitesmoke;
        padding: 10px 20px;

        &.first-item{
            padding-left: 20px;
        }
        &.last-item{
            padding-right: 20px;
        }
    }

    &.first-item{
        padding-left: 0;
    }
    &.last-item{
        padding-right: 0;
    }
    &.active{
        background: black;
        color: white;
        font-weight: bold;
        padding: 10px 20px;
        &.first-item{
            padding-left: 20px;
        }
    }
}
.setting-content{
    justify-content: stretch;
    &>*{
        margin-bottom: 25px;
        &:last-child{
            margin-bottom: 0;
        }
    }
}
.mail-input-group{
    border: 1px solid lightgray;
    border-radius: 5px;
    overflow: hidden;

    .button{
        flex-shrink: 0;
    }
}
</style>