import AxiosWrapper from './AxiosWrapper';

const RESOURCE_URL = 'api/swimlane/';

export default {
    getAll(swimlaneId) {
        return AxiosWrapper.get(`${RESOURCE_URL}${swimlaneId}/column`);
    },
};
