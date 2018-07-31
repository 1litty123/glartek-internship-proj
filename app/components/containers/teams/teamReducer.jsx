const INITIAL_STATE = {
    teams: [],
    profileTeams: [],
    deleted:[],
    updated:[],
    created:[],
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'PROFILE_TEAM_DATA_RECEIVED':
        return { ...state, profileTeams: action.payload.data }
        case 'TEAM_DATA_RECEIVED':
            return { ...state, teams: action.payload.data }
        case 'TEAM_CREATED':
            return { ...state, created: action.payload.data }
        case 'TEAM_UPDATED':
            return { ...state, updated: action.payload.data }
        case 'TEAM_DELETED':
            return { ...state, created: action.payload.data }
        default:
            return state
    }
}
