import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'

import Consts from '../../../utils/consts'

import { getTaskData } from './timeLineActions'
import TimeLineTaskBlock from './blocks/timeLineTaskBlock'

class TimeLineTask extends React.Component {

    constructor (props){
        super(props)
    }
    // Chama a action creator para fazer pedido à rest
    componentDidMount() {
        this.props.getTaskData("/Tasks?access_token=" + JSON.parse(localStorage.getItem('_user')).id)
    }

    render() {
        const renderTimeLine = () => {
            const data = this.props.timeLineProps || []
            //console.log(data)
            if (data != []) {

                return data.map(reg => (
                    <TimeLineTaskBlock
                        key={reg.key}
                        title={reg.title}
                        state={reg.state}
                        iconColor={reg.iconColor}
                        icon={reg.icon}
                        description={reg.description}
                        date={reg.date}
                        buttonName={reg.buttonName} />
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
        timeLineProps: state.tasks.tasks
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getTaskData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeLineTask)