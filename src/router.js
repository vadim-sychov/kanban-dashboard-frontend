import Vue from 'vue'
import VueRouter from 'vue-router'
import KanbanBoard from "./components/pages/KanbanBoard";
import UserManagement from "./components/pages/UserManagement";
import Error404 from "./components/pages/404";
import Auth from "./components/pages/Auth";
import userStore from './store/user';
import store from './vuex/'

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '*', redirect: '/404' },
        { name: 'login', path: '/login', component: Auth, meta: { title: 'Авторизація' } },
        { name: 'kanban_board', path: '/', component: KanbanBoard, meta: { title: 'Канбан-дошка' } },
        { name: 'user_management', path: '/users', component: UserManagement, meta: { title: 'Керування користувачами' } },
        { name: 'error_page', path: '/404', component: Error404, meta: { title: 'Сторінка не знайдена' } },
    ]
});

router.afterEach((to) => {
    // Change page title on route title
    if (to.meta.title !== undefined) {
        document.title = to.meta.title;
    }
});

router.beforeEach((to, from, next) => {
    if (to.name === 'login') {
        next();
    }

    // Update user data
    userStore.getUserInfo()
        .then(response => {
            store.commit('saveUserData', response.data.data);

            next();
        })
        .catch(() => {
            next('/login')
        });
});

export default router;
