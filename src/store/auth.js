import AxiosWrapper from './AxiosWrapper';

export default {
    auth(username, password) {
        let data  = {username: username, password: password};
        return AxiosWrapper.post(`api/login`, data);
    },
};
