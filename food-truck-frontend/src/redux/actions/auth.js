export const ACTION_LOGIN = 'LOGIN';
export const ACTION_LOGOUT = 'LOGOUT';
export const ACTION_UPDATE = 'AUTH_UPDATE';

export function login(email, password) {
    return {
        type: ACTION_LOGIN,
        email,
        password,
    };
}

export function logout() {
    return {
        type: ACTION_LOGOUT,
    };
}

export function authUpdate(email, password) {
    return {
        type: ACTION_UPDATE,
        email,
        password,
    };
}
