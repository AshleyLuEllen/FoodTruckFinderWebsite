import { ACTION_LOGIN, ACTION_LOGOUT, ACTION_UPDATE } from '../actions/auth';

const initialState = {
    jwt: null,
    userId: null,
    isLoggedIn: false,
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_LOGIN:
        case ACTION_UPDATE:
            return {
                ...state,
                jwt: action.jwt,
                userId: action.userId,
                isLoggedIn: true,
            };
        case ACTION_LOGOUT:
            return {
                ...state,
                jwt: null,
                isLoggedIn: false,
                userId: null,
            };
        default:
            return state;
    }
}
