const INITIAL_STATE = {
    tasks: []
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'DATA_TASK_RECEIVED':
            const taskMap = action.payload.data.map((obj) => {
                let auxObj = {}
                auxObj = {
                    key: obj.id,
                    title: obj.title,
                    state: obj.state,
                    iconColor: 'lazur-bg',
                    icon: 'tasks',
                    description: obj.problem,
                    date: obj.created_time
                }
                return auxObj
            })
            return { ...state, tasks: taskMap }

        case 'DATA_TASK_UNAUTHORIZED':
            return { ...state, tasks: null }

        default:
            return state
    }
}