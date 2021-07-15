import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null 
}

export default function register(state = initialState, actions) {
    const { type, payload } = actions;

    switch(type) {
        case USER_LOADED : 
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: payload
            }
        case REGISTER_SUCCESS :
        case LOGIN_SUCCESS :
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                loading: false,
                isAuthenticated: true,
            }
        case REGISTER_FAIL :
        case AUTH_ERROR :
        case LOGIN_FAIL :
        case LOGOUT :
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                loading: false,
                isAuthenticated: false
            }
        default: 
        return state;
    }
}