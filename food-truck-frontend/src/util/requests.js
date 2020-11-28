import axios from 'axios';

export async function _get(url, config = {}) {
    return axios.get(url, config);
}

export async function getWithAuth(url, authObj, config = {}) {
    if (!authObj) {
        return _get(url, config);
    }

    return axios.get(url, {
        headers: {
            Authorization: authObj.jwt,
        },
        ...config,
    });
}

export async function _delete(url, config = {}) {
    return axios.delete(url, config);
}

export async function deleteWithAuth(url, authObj, config = {}) {
    if (!authObj) {
        return _delete(url, config);
    }

    return axios.delete(url, {
        headers: {
            Authorization: authObj.jwt,
        },
        ...config,
    });
}

export async function _put(url, data, config = {}) {
    return axios.put(url, data, config);
}

export async function putWithAuth(url, data, authObj, config = {}) {
    if (!authObj) {
        return _put(url, data, config);
    }

    return axios.put(url, data, {
        headers: {
            Authorization: authObj.jwt,
        },
        ...config,
    });
}

export async function _post(url, data, config = {}) {
    return axios.post(url, data, config);
}

export async function postWithAuth(url, data, authObj, config = {}) {
    if (!authObj) {
        return _post(url, data, config);
    }

    return axios.post(url, data, {
        headers: {
            Authorization: authObj.jwt,
        },
        ...config,
    });
}

export async function _patch(url, data, config = {}) {
    return axios.patch(url, data, config);
}

export async function patchWithAuth(url, data, authObj, config = {}) {
    if (!authObj) {
        return _patch(url, data, config);
    }

    return axios.patch(url, data, {
        headers: {
            Authorization: authObj.jwt,
        },
        ...config,
    });
}
