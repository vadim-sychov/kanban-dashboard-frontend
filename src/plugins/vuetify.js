import Vue from 'vue'
import Vuetify from 'vuetify/lib';
import 'mdbvue/lib/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import 'bootstrap-css-only/css/bootstrap.min.css';
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
    customVariables: ['~/assets/variables.sass'],
    treeShake: true,
    icons: {
        iconfont: 'md',
    },
    theme: {
        default: 'dark',
        // dark: true,
        themes: {
            light: {
                primary: '#53acd6',
                secondary: '#b0bec5',
                accent: '#8c9eff',
                error: '#b71c1c',
                success: '#4CAF50',
                warning: '#FB8C00',
            },
        },
    },
});
