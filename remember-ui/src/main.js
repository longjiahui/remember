import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './plugins/api';
import ElementUI from './plugins/elementui';
import utils from './plugins/utils';

Vue.use(utils);
Vue.use(api);
Vue.use(ElementUI);

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
