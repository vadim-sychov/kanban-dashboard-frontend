import AxiosWrapper from './AxiosWrapper';

const RESOURCE_URL = 'api/swimlane/';

export default {
    getAll() {
        return AxiosWrapper.get(`${RESOURCE_URL}`);
    },
};
