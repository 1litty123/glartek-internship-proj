import axios from 'axios'
import Consts from '../../../utils/consts'

// Action creator
export const getAlarmData = (query) => {
    return dispatch => {
        if (query) {
            axios.get(Consts.API_URL + query)
                .then(resp => {
                    dispatch({ type: 'DATA_ALARM_RECEIVED', payload: resp })
                })
        }
    }
}

export const getTaskData = (query) => {
    return dispatch => {
        if (query) {
            axios.get(Consts.API_URL + query)
                .then(resp => {
                    dispatch({ type: 'DATA_TASK_RECEIVED', payload: resp })
                }).catch(e => dispatch({ type: 'DATA_TASK_UNAUTHORIZED', payload: false }))
        }
    }
}