import { ACTION_LOGIN, ACTION_LOGOUT, ACTION_UPDATE } from '../actions/auth';

const initialState = {
<<<<<<< HEAD
    jwt: null,
=======
    email: '',
    password: '',
>>>>>>> media
    isLoggedIn: false,
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_LOGIN:
        case ACTION_UPDATE:
            return {
                ...state,
<<<<<<< HEAD
                jwt: action.jwt,
=======
                email: action.email,
                password: action.password,
>>>>>>> media
                isLoggedIn: true,
            };
        case ACTION_LOGOUT:
            return {
                ...state,
<<<<<<< HEAD
                jwt: null,
=======
                email: '',
                password: '',
>>>>>>> media
                isLoggedIn: false,
            };
        default:
            return state;
    }
}
