const INITIAL_STATE = {
    mqtt: []
}

export default function (state = INITIAL_STATE, action) {
    //console.log(action.type)
    switch (action.type) {
        case 'TOPIC_SUBSCRIBED':
            if (action.payload) {
                // Copia o objecto existente
                let mqttData = state.mqtt
                action.payload.map(t => {
                    let topicIndex = mqttData.findIndex(x => x.topic == t)
                    if (topicIndex > -1) {
                        console.log(t)
                        return state
                    } else {
                        // modifica o objecto auxiliar com os novos topicos
                        mqttData.push({ topic: t, value: null })
                        console.log(mqttData)
                        // Substitui o objecto existente pelo auxiliar
                        return { ...state, mqtt: mqttData }
                    }
                })
            }
            return state
        case 'TOPIC_UNSUBSCRIBED':
            return state
        case 'TOPIC_RECEIVED':
            // Copia o objecto existente
            let mqttData = state.mqtt
            // modifica o objecto auxiliar com os novos topicos
            let topicIndex = mqttData.findIndex(x => x.topic == action.payload.topic)
            if (topicIndex > -1) {
                mqttData[topicIndex].value = action.payload.value
                // Substitui o objecto existente pelo auxiliar
                return { ...state, mqtt: mqttData }
            } else {
                //console.log(action.payload.topic)
                return state
            }
            console.log(action.payload)
            return state
        default:
            return state
    }
}