import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { getTeamData } from '../teams/teamActions'
import { getSeverities } from '../severities/severityActions'
import { getProfileRole } from '../administration/profiles/profileActions'
import { translate } from 'react-i18next'
import ActiveTasks from './taskListFragments/ActiveTasks'

class TaskList extends React.Component {

    constructor(props) {
        super(props)

        this.access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
        this.TIME_FORMAT = "YYYY-MM-DD kk:mm:ss"

        this.state = {
            activeCollapsed: true,
            historyCollapsed: false
        }
    }

    componentDidMount() {
        this.props.getTeamData()
        this.props.getSeverities()
        this.props.getProfileRole(JSON.parse(localStorage.getItem('_user')).userId)
    }

    handleActiveCollapse = () => {
        this.setState({
            activeCollapsed: !this.state.activeCollapsed
        })
    }

    handleHistoryCollapse = () => {
        this.setState({
            historyCollapsed: !this.state.historyCollapsed
        })
    }

    render() {
        const { t } = this.props;
        const css = {
            label: {
                fontSize: 24,
                fontWeight: 100,
                width: 180,
                cursor: 'pointer'
            }
        }

        return (
            <div className="ibox float-e-margins">
                <div onClick={this.handleActiveCollapse} style={{ cursor: 'pointer' }}>
                    <label style={css.label}>{t('labels.activeTask')}</label>
                    <ActiveTasks typeTask={this.props.typeTask} />
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => bindActionCreators({ getTeamData, getSeverities, getProfileRole }, dispatch)

export default compose(translate('tasks'), connect(mapStateToProps, mapDispatchToProps))(TaskList)
