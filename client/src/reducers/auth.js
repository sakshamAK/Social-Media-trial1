import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null 
}

export default function register(state = initialState, actions) {
    const { type, payload } = actions;

    switch(type) {
        case REGISTER_SUCCESS :
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                loading: false,
                isAuthenticated: true,
            }
        case REGISTER_FAIL :
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