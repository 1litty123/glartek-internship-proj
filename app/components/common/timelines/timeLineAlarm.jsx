import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'

import Consts from '../../../utils/consts'

import { getAlarmData } from './timeLineActions'
import TimeLineAlarmBlock from './blocks/timeLineAlarmBlock'

class TimeLineAlarm extends React.Component {

    constructor (props){
        super(props)
    }
    // Chama a action creator para fazer pedido à rest
    componentDidMount() {
        this.props.getAlarmData(this.props.alarmQuery)
    }

    render() {
        const renderTimeLine = () => {
            const data = this.props.timeLineProps || []
            //console.log(data)
            if (data !== []) {
                const dataAux = data.filter(t => t.status == 'active') || []

                return dataAux.map(reg => (
                    <TimeLineAlarmBlock
                        key={reg.id}
                        title={reg.alarmlist.name}
                        iconColor='red-bg'
                        icon='exclamation-triangle'
                        description={reg.alarmlist.description}
                        date={reg.begin_date} />
                ))
            }
        };
        //console.log(this.props.timeLineProps);
        return (
            <div id="vertical-timeline" className="vertical-container light-timeline no-margins">
                {renderTimeLine()}
            </div>
        )
    }
}

// Passa o objecto de State para as propriedades do componente 'props'
function mapStateToProps(state) {
    return {
        timeLineProps: state.alarms.alarms
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAlarmData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeLineAlarm)