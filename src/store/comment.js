import AxiosWrapper from './AxiosWrapper';

const RESOURCE_URL = 'api/task/';

export default {
    getAll(taskId) {
        return AxiosWrapper.get(`${RESOURCE_URL}${taskId}/comment`);
    },
    create(taskId, data) {
        return AxiosWrapper.post(`${RESOURCE_URL}${taskId}/comment/`, data);
    },
};
