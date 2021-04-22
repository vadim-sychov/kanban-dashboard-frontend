import axios from 'axios';

export default {

    get: function(path, config) {
        return axios.get(this.preparePath(path), config);
    },
    delete: function(path) {
        return axios.delete(this.preparePath(path));
    },
    put: function(path, data) {
        return axios.put(this.preparePath(path), data);
    },
    post: function(path, data) {
        return axios.post(this.preparePath(path), data);
    },

    preparePath: function (path) {
        return path + '?token=' + localStorage.authToken;
    }
}
