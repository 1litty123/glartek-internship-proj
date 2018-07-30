const INITIAL_STATE = {
    periods: []
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'CREATE_PERIOD':
            const newCron = {
                name: action.payload.data.name,
                description: action.payload.data.description,
                dayOfWeek: action.payload.data.dayOfWeek,
                month: action.payload.data.month,
                dayOfMonth: action.payload.data.dayOfMonth,
                hour: action.payload.data.hour,
                minute: action.payload.data.minute,
                second: action.payload.data.second,
                active: action.payload.data.active,
                id: action.payload.data.id
            }
            let newCrons = state.periods
            newCrons.push(newCron)
            return { ...state, period: newCrons }
        case 'GET_PERIODS':
            let taskMap = action.payload.data.map(obj => {
                let auxObj = {}
                auxObj = {
                    name: obj.name,
                    description: obj.description,
                    dayOfWeek: obj.dayOfWeek,
                    month: obj.month,
                    dayOfMonth: obj.dayOfMonth,
                    hour: obj.hour,
                    minute: obj.minute,
                    second: obj.second,
                    active: obj.active,
                    id: obj.id
                }
                return auxObj
            })
            return { ...state, tasks: taskMap }
        default:
            return state
    }
}
