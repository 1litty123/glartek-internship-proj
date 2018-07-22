import mqtt from 'mqtt'
import Const from './consts'

const clientId = 'GlarBoard_' + Math.random().toString(16).substr(2, 8)

const options = {
    keepalive: 10,
    clientId: clientId,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
    },
}

const client = mqtt.connect(Const.MQTT_URL, options)

export const connection = client


client.on('error', function (err) {
    console.log(err)
})

export const onTopicMsg = () => {

    return dispatch => {
        connection.on('message', function (topic, message) {
            let value = message.toString()
            dispatch({ type: 'TOPIC_RECEIVED', payload: { topic, value } })
        })
    }
    //console.log(topic + ": " + message.toString())
}


client.on('close', function () {
    console.log(clientId + ' disconnected')
})