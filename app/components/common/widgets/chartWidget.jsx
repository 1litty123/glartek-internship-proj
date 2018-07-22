import React from 'react'
import { connect } from 'react-redux'
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines'
import { bindActionCreators } from 'redux'
import { subTopic, unsubTopic } from '../../../utils/mqttSubscriptions'

// API https://github.com/borisyankov/react-sparklines
// data format ex: [5, 10, 5, 20, 8, 15]

class ChartWidget extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            arrayTag: []
        }
    }

    componentWillMount() {
        console.log(this.props.topic)
        this.props.subTopic([this.props.topic])
        //this.props.onTopicMsg()
    }

    componentWillUnmount() {
        this.props.unsubTopic(this.props.topic)
    }

    componentWillUpdate() {
        const tagTopic = this.props.topic || null
        const widgetArray = this.state.arrayTag || []
        let tag = null

        if (tagTopic != null && widgetArray != []) {
            //console.log(widgetArray)
            const indexTag = this.props.dbTags.mqtt.findIndex(t => t.topic == tagTopic)
            if (indexTag > -1) {
                tag = this.props.dbTags.mqtt[indexTag].value
                //this.setState({tag: tag})
                if (tag !== widgetArray[widgetArray.length - 1]) {
                    this.tagArray(tag)
                }
            }
        }
    }

    tagArray(value) {

        if (value != this.state.arrayTag[this.state.arrayTag.length]) {
            if (this.state.arrayTag.length < 10) {
                const auxArray = this.state.arrayTag
                auxArray.push(value)
                this.setState({ arrayTag: auxArray })
            } else {
                const auxArray = this.state.arrayTag
                auxArray.shift()
                auxArray.push(value)
                this.setState({ arrayTag: auxArray })
            }
        }
    }

    render() {
        const tagTopic = this.props.topic || null
        const widgetArray = this.state.arrayTag || []
        
        return (
            <div className="ibox">

                {!tagTopic
                    ? <div className="ibox-content">
                        <h5>{this.props.title}</h5>
                        <h2>{this.props.value}</h2>
                        <Sparklines data={this.props.data}>
                            <SparklinesLine style={{ fill: "Yes" }} />
                            <SparklinesSpots />
                        </Sparklines>
                    </div>
                    : <div className="ibox-content">
                        <h5>{this.props.title}</h5>
                        {!this.props.dbTags.mqtt.find(t => t.topic == tagTopic)
                            ? <h2>Wait</h2>
                            : <h2>{this.props.dbTags.mqtt.find(t => t.topic == tagTopic).value}</h2>}
                        <Sparklines data={widgetArray}>
                            <SparklinesLine style={{ fill: "Yes" }} />
                            <SparklinesSpots />
                        </Sparklines>
                    </div>}
            </div>
        )
    }
}

// Passa o objecto de State para as propriedades do componente 'props'
const mapStateToProps = state => ({ dbTags: state.mqtt })
const mapDispatchToProps = dispatch => bindActionCreators({ subTopic, unsubTopic }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ChartWidget)