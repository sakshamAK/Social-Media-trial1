import { GET_PROFILE, PROFILE_ERROR } from '../actions/types'

const InitialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}

export default function setProfile(state = InitialState, action) {
    const { type, payload } = action;
    switch(type) {
        case GET_PROFILE :
            return {
                ...state,
                loading: false,
                profile: payload
            };
        case PROFILE_ERROR :
            return {
                ...state,
                error: payload,
                loading: false
            };
        default : {
            return state;
        }
    }
}