import React from 'react'
import Consts from './consts'

export const alarmStream = () => {

    return dispatch => {
        const stream = new EventSource(Consts.API_URL + '/Alarms/change-stream?filter[include][alarmlist]&_format=event-stream')
        stream.addEventListener('data', function (msg) {
            const data = JSON.parse(msg.data)
            dispatch({ type: 'NEW_ALARM_RECEIVED', payload: data })
        })
    }
}



