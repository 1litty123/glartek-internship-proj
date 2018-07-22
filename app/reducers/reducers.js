import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import loginReducer from '../components/login/loginReducer'
import mqttReducer from '../utils/mqttReducer'
import alarmReducer from '../components/containers/alarms/alarmReducer'
import taskReducer from '../components/containers/tasks/taskReducer'
import profileReducer from '../components/layouts/layoutReducer'

const rootReducer = combineReducers({
    auth: loginReducer,
    mqtt: mqttReducer,
    profile: profileReducer,
    alarms: alarmReducer,
    tasks: taskReducer,
    form: formReducer
})
export default rootReducer
