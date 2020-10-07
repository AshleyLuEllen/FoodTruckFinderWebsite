import { ACTION_LOGIN, ACTION_LOGOUT, ACTION_UPDATE } from '../actions/auth';

const initialState = {
    email: '',
    password: '',
    isLoggedIn: false
}

export function reducer(state = initialState, action) {
    switch(action.type) {
        case ACTION_LOGIN:
        case ACTION_UPDATE:
            return {
                ...state,
                email: action.email,
                password: action.password,
                isLoggedIn: true
            }    
        case ACTION_LOGOUT:
            return {
                ...state,
                email: '',
                password: '',
                isLoggedIn: false
            }
        default:
            return state;
    }
}