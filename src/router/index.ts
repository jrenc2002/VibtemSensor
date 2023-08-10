import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/homeview',
    },
    {
        path: '/homeview',
        name: 'HomeView',
        meta: {
            title: '首页',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/HomeView.vue'),
        children: [
            {
                path: '/mainview',
                name: 'MainView',
                meta: {
                    title: '显示界面',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "login" */ '../views/MainView.vue'),
            },
            {
                path: '/analysisview',
                name: 'AnalysisView',
                meta: {
                    title: '分析界面',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "login" */ '../views/AnalysisView.vue'),
            },
            {
                path: '/setiew',
                name: 'SetView',
                meta: {
                    title: '设置界面',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "login" */ '../views/SetView.vue'),
            },
            {
                path: '/alarmview',
                name: 'AlarmView',
                meta: {
                    title: '报警数据',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "login" */ '../views/AlarmView.vue'),
            }
        ]
    },

    {
        path: '/403',
        name: 'ErrorPage',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | 生物设备`;
//     next('/loginview');
//     // const token = localStorage.getItem('token');
//     // if (!token && !['/login'].includes(to.path)) {
//     //     console.log(to.path);
//     //     next('/login');
//     // } else {
//     //     next()
//     // }
//
// });

export default router;