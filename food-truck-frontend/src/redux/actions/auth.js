export const ACTION_LOGIN = "LOGIN";
export const ACTION_LOGOUT = "LOGOUT";

export function login(email, password) {
    return {
        type: ACTION_LOGIN,
        email,
        password
    }
}

export function logout() {
    return {
        type: ACTION_LOGOUT
    }
}
