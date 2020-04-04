<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  watch:{
    $route:{
      immediate: true,
      handler(newRoute){
        if(newRoute.path === '/'){
          //判断是否登录
          let token = localStorage.getItem('token');
          if(!token){
            this.$router.push('/login');
          }else{
            this.$router.push('/console');
          }
        }
      }
    }
  }
}
</script>

<style lang="less">
@import url(~@/assets/style/utils);
*{
  margin: 0;
  box-sizing: border-box;
}
html{
  font-family: "Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif;
  letter-spacing: 1px;
  font-size: var(--fs-base);
  background: #f3f3f3;
  min-height: 100vh;
  color: var(--text-color-dark);
}
a{
  text-decoration: none;
}
a, input{
  color: var(--text-color-default);
  font-size: var(--fs-base);
  letter-spacing: 1px;
}
</style>
