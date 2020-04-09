import {
    Pagination,
    Dialog,
    Loading,
    Icon,
    TimePicker,
} from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';

export default Vue=>{
    Vue.use(Pagination);
    Vue.use(Dialog);
    Vue.use(Loading);
    Vue.use(Icon);
    Vue.use(TimePicker);

    Vue.use(Loading.directive);
    Vue.prototype.$loading = Loading.service;
}