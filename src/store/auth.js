import axios from 'axios'

export default {
    auth(username, password) {
        return axios.post(`api/login_check`, {username: username, password: password});
    },
};
