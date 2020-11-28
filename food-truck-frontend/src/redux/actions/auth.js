export const ACTION_LOGIN = 'LOGIN';
export const ACTION_LOGOUT = 'LOGOUT';
export const ACTION_UPDATE = 'AUTH_UPDATE';

export function login(jwt) {
    return {
        type: ACTION_LOGIN,
        jwt,
    };
}

export function logout() {
    return {
        type: ACTION_LOGOUT,
    };
}

export function authUpdate(jwt) {
    return {
        type: ACTION_UPDATE,
        jwt,
    };
}
