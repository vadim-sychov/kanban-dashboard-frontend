import AxiosWrapper from './AxiosWrapper';

const RESOURCE_URL = 'api/priority/';

export default {
    getAll() {
        return AxiosWrapper.get(`${RESOURCE_URL}`);
    },
};
