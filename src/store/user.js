import AxiosWrapper from './AxiosWrapper';

const RESOURCE_URL = 'api/user/';

export default {
    getUserInfo() {
        return AxiosWrapper.get(`${RESOURCE_URL}info`);
    },
    getAll() {
        return AxiosWrapper.get(`${RESOURCE_URL}`);
    },
    read(id) {
        return AxiosWrapper.get(`${RESOURCE_URL}${id}`);
    },
    create(data) {
        return AxiosWrapper.post(`${RESOURCE_URL}`, data);
    },
    update(id, data) {
        return AxiosWrapper.put(`${RESOURCE_URL}${id}`, data);
    },
    delete(id) {
        return AxiosWrapper.delete(`${RESOURCE_URL}${id}`);
    },
};
