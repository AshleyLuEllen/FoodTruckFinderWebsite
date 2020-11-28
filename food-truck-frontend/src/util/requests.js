import axios from 'axios';
import _ from 'lodash';

export async function _get(url, config = {}) {
    return axios.get(url, config);
}

export async function getWithAuth(url, authObj, config = {}) {
    if (!authObj) {
        return _get(url, config);
    }

    return axios.get(
        url,
        _.merge(
            {
                headers: {
                    Authorization: authObj.jwt,
                },
            },
            config
        )
    );
}

export async function _delete(url, config = {}) {
    return axios.delete(url, config);
}

export async function deleteWithAuth(url, authObj, config = {}) {
    if (!authObj) {
        return _delete(url, config);
    }

    return axios.delete(
        url,
        _.merge(
            {
                headers: {
                    Authorization: authObj.jwt,
                },
            },
            config
        )
    );
}

export async function _put(url, data, config = {}) {
    return axios.put(url, data, config);
}

export async function putWithAuth(url, data, authObj, config = {}) {
    if (!authObj) {
        return _put(url, data, config);
    }

    return axios.put(
        url,
        data,
        _.merge(
            {
                headers: {
                    Authorization: authObj.jwt,
                    ...(config.headers || {}),
                },
            },
            config
        )
    );
}

export async function _post(url, data, config = {}) {
    return axios.post(url, data, config);
}

export async function postWithAuth(url, data, authObj, config = {}) {
    if (!authObj) {
        return _post(url, data, config);
    }

    return axios.post(
        url,
        data,
        _.merge(
            {
                headers: {
                    Authorization: authObj.jwt,
                },
            },
            config
        )
    );
}

export async function _patch(url, data, config = {}) {
    return axios.patch(url, data, config);
}

export async function patchWithAuth(url, data, authObj, config = {}) {
    if (!authObj) {
        return _patch(url, data, config);
    }

    return axios.patch(
        url,
        data,
        _.merge(
            {
                headers: {
                    Authorization: authObj.jwt,
                },
            },
            config
        )
    );
}

export default {
    get: _get,
    getWithAuth,
    delete: _delete,
    deleteWithAuth,
    put: _put,
    putWithAuth,
    post: _post,
    postWithAuth,
    patch: _patch,
    patchWithAuth,
};
