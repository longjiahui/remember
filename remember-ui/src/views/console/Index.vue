<template>
    <div>
        <nav class="navbar container-row row-vertical-center box">
            <div class="auto-width navbar-content">
                <div class="navbar-group container-column">
                    <router-link :class="`nav-item first-item ${$route.path==='/console/all'?'active':''}`" to="/console/all">知识库</router-link>
                    <router-link :class="`nav-item ${$route.path==='/console/review'?'active':''}`" to="/console/review">待复习</router-link>
                </div>
                <div class="navbar-group container-column">
                    <div class="nav-item">设置</div>
                    <div @click="handleLogout" class="nav-item last-item"><i class="iconfont icon-log-out"></i></div>
                </div>
            </div>
        </nav>
        <div class="auto-width">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
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
</style>