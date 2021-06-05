import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userData: {
            id: 0,
            email: '',
            role: '',
        },
    },
    mutations: {
        saveUserData(state, userData) {
            state.userData = userData;
        }
    },
    getters: {
        isAdminRole(state) {
            return state.userData.role === 'ROLE_ADMIN';
        }
    }
})
