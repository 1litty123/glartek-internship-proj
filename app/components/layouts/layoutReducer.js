const INITIAL_STATE = {
    profile: []
}

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'PROFILE_RECEIVED':
            return { ...state, profile: action.payload.data }

        case 'PROFILE_UNAUTHORIZED':
            return { ...state, profile: null }

        default:
            return state
    }
}