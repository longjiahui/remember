import {
    Pagination,
    Dialog,
    Loading,
    Icon,
} from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';

export default Vue=>{
    Vue.use(Pagination);
    Vue.use(Dialog);
    Vue.use(Loading);
    Vue.use(Icon);

    Vue.use(Loading.directive);
    Vue.prototype.$loading = Loading.service;
}