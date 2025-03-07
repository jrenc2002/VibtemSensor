import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router';
import "./tailwindcss.css"
import VXETable from 'vxe-table'
import 'xe-utils'
import 'vxe-table/lib/style.css'

const pinia = createPinia()


// import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(VXETable);
// 注册elementplus图标

// // 自定义权限指令
// app.directive('permiss', {
//     mounted(el, binding) {
//         // if (!permiss.key.includes(String(binding.value))) {
//         //     el['hidden'] = true;
//         // }
//     },
// });

app.mount('#app');
