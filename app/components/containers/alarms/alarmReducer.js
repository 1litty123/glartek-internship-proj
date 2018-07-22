const INITIAL_STATE = {
    alarms: []
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'DATA_ALARM_RECEIVED':
            return { ...state, alarms: action.payload.data }

        case 'NEW_ALARM_RECEIVED':
        console.log(action.payload)
            let alarmData = state.alarms
            alarmData.push(action.payload.data)
            return { ...state, alarms: alarmData }

        default:
            return state
    }
}