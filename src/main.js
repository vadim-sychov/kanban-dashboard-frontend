import Vue from 'vue';
import App from './App';
import router from './router';
import store from './vuex'
import axios from 'axios'
import vuetify from './plugins/vuetify';

Vue.config.devtools = true;

let host = window.location.hostname;

if (host === 'localhost') {
    axios.defaults.baseURL = 'http://taskmanager-backend.com/';
} else {
    axios.defaults.baseURL = 'https://api.' + host + '/';
}

new Vue({
    template: '<App/>',
    components: {App},
    router,
    store,
    vuetify,
    axios,
}).$mount('#app');
