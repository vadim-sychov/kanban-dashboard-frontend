import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from "./components/pages/Dashboard";
import Error404 from "./components/pages/404";

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        { path: '*', redirect: '/404' },
        { name: 'dashboard', path: '/', component: Dashboard },
        { name: 'error_page', path: '/404', component: Error404 },
    ]
});
