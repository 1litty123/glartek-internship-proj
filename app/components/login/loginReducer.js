const userKey = '_user'
const INITIAL_STATE = {
        user: JSON.parse(localStorage.getItem(userKey)),
        validToken: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'TOKEN_VALIDATED':
            if(action.payload) {
                return { ...state, validToken: true }
            } else {
                return { ...state, validToken: false, user: null }
            }
        case 'LOGOUT_USER':
            if(action.payload) {
                localStorage.removeItem(userKey)
                return { ...state, validToken: false }
            } else {
                return state
            }
        case 'USER_FETCHED':
            localStorage.setItem(userKey, JSON.stringify(action.payload))
            return { ...state, user: action.payload, validToken: true }
        default:
            return state
    }
}