<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
@import url(~@/assets/style/utils);

html{
  font-family: "Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif;
  letter-spacing: 1px;
  font-size: var(--fs-base);
  font-weight: lighter;
  background: #f3f3f3;
  min-height: 100vh;
  color: var(--text-color-dark);
}
a{
  text-decoration: none;
}
a, input{
  color: var(--text-color-default);
}
</style>
