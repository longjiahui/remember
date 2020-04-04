<template>
    <div>
        <nav class="navbar container-row row-vertical-center">
            <div class="auto-width navbar-content">
                <div class="navbar-group container-column">
                    <div class="nav-item first-item">知识库</div>
                    <div class="nav-item">待复习</div>
                </div>
                <div class="navbar-group container-column">
                    <div class="nav-item">设置</div>
                    <div @click="handleLogout" class="nav-item last-item">退出</div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
    methods: {
        handleLogout(){
            localStorage.removeItem('token');
            this.$router.push('/login');
        }
    }
}
</script>

<style lang="less" scoped>
@import url(~@/assets/style/variable);

.navbar{
    font-size: var(--fsL);
    // font-weight: bold;
    height: @largeHeight;
    background: white;
    box-shadow: var(--shadow-light)
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
}
</style>