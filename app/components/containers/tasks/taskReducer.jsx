const INITIAL_STATE = {
    activeTasks: [],
    historyTasks: [],
    tasks: [],
    profiles: []
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        // [GN] action used to get the profile names' for each task
        case 'GET_PROFILES':
            return { ...state, profiles: action.payload.data }
        case 'GET_ACTIVE_TASKS':
            return { ...state, activeTasks: action.payload.data }
        case 'GET_TASKS':
            return { ...state, tasks: action.payload }
        case 'GET_HISTORY_TASKS':
            return { ...state, historyTasks: action.payload.data }
        case 'DATA_TASK_UNAUTHORIZED':
            return { ...state, tasks: null }

        case 'ADD_TASK':
            let _tasks = state.tasks
            _tasks.push(action.payload.data)
            return { ...state, tasks: _tasks }
        default:
            return state
    }
}
