(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d7aa2bc"],{"44a4":function(t,i,e){"use strict";e.r(i);var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",[e("nav",{staticClass:"navbar container-row row-vertical-center box"},[e("div",{staticClass:"auto-width navbar-content"},[e("div",{staticClass:"navbar-group container-column"},[e("router-link",{class:"nav-item first-item "+("/console/all"===t.$route.path?"active":""),attrs:{to:"/console/all"}},[t._v("知识库")]),e("router-link",{class:"nav-item "+("/console/review"===t.$route.path?"active":""),attrs:{to:"/console/review"}},[t._v("待复习")])],1),e("div",{staticClass:"navbar-group container-column"},[e("div",{staticClass:"nav-item",on:{click:function(i){t.settingDialogVisiable=!0}}},[t._v("设置")]),e("div",{staticClass:"nav-item last-item",on:{click:t.handleLogout}},[e("i",{staticClass:"iconfont icon-log-out"})])])])]),e("el-dialog",{attrs:{title:"设置",width:"400px",visible:t.settingDialogVisiable},on:{"update:visible":function(i){t.settingDialogVisiable=i}}},[e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.settingLoading,expression:"settingLoading"}],staticClass:"setting-content"},[e("p",[t._v("设置推送邮箱")]),e("transition",{attrs:{name:"slide-fade",mode:"out-in"}},[t.setting.email&&!t.emailInputVisible?e("div",{key:"1",staticClass:"container-column column-center-vertical"},[e("div",[t._v(t._s(t.setting.email))]),e("button",{staticClass:"button opacity-hover",on:{click:function(i){t.emailInputVisible=!0}}},[t._v("重新绑定")])]):e("div",{key:"2",staticClass:"container-column mail-input-group"},[e("button",{staticClass:"button column-item opacity-hover",on:{click:function(i){t.emailInputVisible=!1}}},[t._v("返回")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.emailInput,expression:"emailInput"}],staticClass:"input column-item-main",attrs:{disabled:t.verifying,type:"text",placeholder:"example@domain"},domProps:{value:t.emailInput},on:{input:function(i){i.target.composing||(t.emailInput=i.target.value)}}}),e("transition",{attrs:{name:"fade",mode:"out-in"}},[t.verifying?e("button",{key:"1",staticClass:"button column-item opacity-hover",on:{click:t.handleCheckVerifyState}},[t._v("查看验证状态("+t._s(t.cd)+")")]):e("button",{key:"2",staticClass:"button column-item opacity-hover",on:{click:t.handleVerify}},[t._v("验证")])])],1)]),e("p",[t._v("设置推送时间")]),e("transition",{attrs:{name:"slide-fade",mode:"out-in"}},[t.setting.triggerTime&&!t.triggerTimeInputVisible?e("div",{key:"1",staticClass:"container-column column-center-vertical"},[e("div",[t._v(t._s(t.$utils.getDayTime(new Date(t.setting.triggerTime))))]),e("button",{staticClass:"button column-item opacity-hover",on:{click:function(i){t.triggerTimeInputVisible=!0}}},[t._v("重新设置")])]):e("div",{key:"2",staticClass:"container-column column-center-vertical"},[e("el-time-picker",{attrs:{"arrow-control":"",placeholder:"选择推送时间"},model:{value:t.setting.triggerTime,callback:function(i){t.$set(t.setting,"triggerTime",i)},expression:"setting.triggerTime"}}),e("button",{staticClass:"button column-item opacity-hover",on:{click:t.handleSaveTriggerTime}},[t._v("保存")])],1)])],1)]),e("div",{staticClass:"auto-width"},[e("transition",{attrs:{name:"fade",mode:"out-in"}},[e("router-view")],1)],1)],1)},a=[],o={data:function(){return{emailInputVisible:!1,settingDialogVisiable:!1,settingLoading:!1,verifying:!1,verifyLock:null,setting:{},emailInput:"",triggerTimeInputVisible:null,cd:0}},watch:{settingDialogVisiable:function(t){var i=this;t&&(this.settingLoading=!0,this.$api.user.getSetting().then((function(t){i.settingLoading=!1,i.setting=t})))}},methods:{handleSaveTriggerTime:function(){var t=this;this.$api.user.saveSetting({triggerTime:this.setting.triggerTime.getTime()}).then((function(){t.triggerTimeInputVisible=!1}))},handleCheckVerifyState:function(){var t=this;this.$api.user.getSetting().then((function(i){t.emailInput===i.email&&(t.email=i.email,clearInterval(t.verifyLock),t.verifyLock=!1,t.verifying=!1,t.emailInputVisible=!1)}))},handleVerify:function(){var t=this;this.emailInput&&this.$api.user.verifyEmail(this.emailInput).then((function(){t.verifying=!0,t.verifyLock&&(clearInterval(t.verifyLock),t.verifyLock=null),t.cd=300,t.verifyLock=setInterval((function(){t.cd-=1,t.cd<=0&&(t.verifying=!1,clearInterval(t.verifyLock),t.verifyLock=!1)}),1e3)}))},handleLogout:function(){localStorage.removeItem("token"),this.$router.push("/login")}}},s=o,l=(e("8f49"),e("2877")),c=Object(l["a"])(s,n,a,!1,null,"3c21dc85",null);i["default"]=c.exports},"8f49":function(t,i,e){"use strict";var n=e("cfa1"),a=e.n(n);a.a},cfa1:function(t,i,e){}}]);