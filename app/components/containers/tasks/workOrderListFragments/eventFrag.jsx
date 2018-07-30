import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faPlus, faPlay, faCheck, faPause, faBan, faTimes, faShareSquare, faChevronDown, faChevronUp, faStopwatch } from '@fortawesome/fontawesome-free-solid'
import moment from 'moment'
import { translate } from 'react-i18next'
import { getEventProfile } from '../taskActions'

class Event extends React.Component {

    constructor(props) {
        super(props)
        this.TIME_FORMAT = "YYYY-MM-DD kk:mm:ss"

        this.state = {
            collapsed: false,
            user: null
        }
    }

    componentDidMount() {
        this.props.getEventProfile(this.props.event.id, this.props.instanceId, this.props.context)
            .then(resp => {
                this.setState({
                    user: resp.data
                })
            })
    }

    //events: created, begin, abort, pause, resume, solve, defer, reassign
    mapElements = (event) => {
        if (event)
            switch (event.eventName) {
                case 'created':
                    return { color: '#2abc25', name: this.props.t("labels.created"), icon: faPlus }
                case 'solve':
                    return { color: '#2abc25', name: this.props.t("labels.solved"), icon: faCheck }
                case 'begin':
                    return { color: '#5bc5e5', name: this.props.t("labels.begin"), icon: faPlay }
                case 'pause':
                    return { color: '#797a79', name: this.props.t("labels.paused"), icon: faPause }
                case 'abort':
                    return { color: '#ED6A5A', name: this.props.t("labels.aborted"), icon: faBan }
                case 'defer':
                    return { color: '#ED6A5A', name: this.props.t("labels.deferred"), icon: faTimes }
                case 'reassign':
                    return { color: '#797a79', name: this.props.t("labels.reassigned"), icon: faShareSquare }
                case 'overdue':
                    return { color: '#ffc105', name: this.props.t("labels.overdue"), icon: faStopwatch }
            }
    }

    handleCollapse = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    render() {
        const { t } = this.props;
        const css = {
            collapsableDown: {
                backgroundColor: 'white',
                width: '100%',
                textAlign: 'center',
                cursor: 'pointer'
            },
            collapsableUp: {
                backgroundColor: 'white',
                width: '100%',
                textAlign: 'center',
                cursor: 'pointer'
            }
        }

        const elements = this.mapElements(this.props.event)
        return (
            <div className="vertical-timeline-block">
                <div className="vertical-timeline-icon" style={{ backgroundColor: elements.color }} >
                    <FontAwesomeIcon icon={elements.icon} style={{ marginTop: 9 }} color="white" />
                </div>
                <div className="vertical-timeline-content">
                    <h3 style={{ display: 'block' }}>{elements.name}</h3>
                    <div className={elements.name === "Created" ? "hidden" : ""}>
                        <label>{t("labels.by")}</label>&nbsp;<small>{this.state.user ? this.state.user.username : '-'}</small>
                    </div>
                    <small>{moment(this.props.event.timestamp).local().format(this.TIME_FORMAT)}</small>
                    {!this.props.event._comment ? null :
                        <div onClick={this.handleCollapse}>
                            <p />
                            <div style={css.collapsableDown} className={!this.state.collapsed ? "" : "hidden"}>
                                <FontAwesomeIcon icon={faChevronDown} color="rgba(0,0,0,0.2)" />
                            </div>
                            <div className={this.state.collapsed ? "" : "hidden"}>
                                <label style={{ display: 'block' }}>{t("labels.reason")}</label>
                                <small>{this.props.event._comment.reason}</small>
                                <p />
                                <label style={{ display: 'block' }}>{t("labels.description")}</label>
                                <small>{this.props.event._comment.description ? this.props.event._comment.description : "-"}</small>
                                <p />
                                <div style={css.collapsableUp} >
                                    <FontAwesomeIcon icon={faChevronUp} color="rgba(0,0,0,0.2)" />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => bindActionCreators({ getEventProfile }, dispatch)

export default compose(translate('tasks'), connect(mapStateToProps, mapDispatchToProps))(Event)
