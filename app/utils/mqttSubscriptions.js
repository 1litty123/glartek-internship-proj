import { connection } from './mqtt'

export const subTopic = (topic) => {
    return dispatch => {
        if (topic) {
            if (!connection.connected) {
                connection.on('connect', function () {
                    console.log(connection.connected)
                    connection.subscribe(topic)
                    dispatch({ type: 'TOPIC_SUBSCRIBED', payload: topic })
                })
            } else {
                connection.subscribe(topic)
                dispatch({ type: 'TOPIC_SUBSCRIBED', payload: topic })
            }

        }
    }
}

export const unsubTopic = (topic) => {
    return dispatch => {
        if (topic) {
            console.log('Unsubscribe')
            connection.unsubscribe(topic)
            dispatch({ type: 'TOPIC_UNSUBSCRIBED', payload: topic })
        }
    }
}

