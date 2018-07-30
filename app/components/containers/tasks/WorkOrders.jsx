import React from 'react';
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import Evolutionary from './taskListFragments/ActiveTasks'
import Preventive from './taskListFragments/preventiveTasks'
import Corrective from './taskListFragments/correctiveTasks'
import { bindActionCreators, compose } from 'redux'
import { getActiveTasks } from './taskActions'
import { getChecklists } from '../checklists/checklistActions'
import { getProfileTeams } from '../profile/profileActions'

const tabs = {
    Preventive: 0,
    Corrective: 1,
    Evolutionary: 2,
}
Object.freeze(tabs)

class WorkOrders extends React.Component {

    constructor(props) {
        super(props)

        this.access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
        this.TIME_FORMAT = "YYYY-MM-DD kk:mm:ss"
        this.active = tabs.Preventive

        this.state = {
            type: "Tasks",
            typeTask: "",
        }

    }

    componentDidMount() {
        this.props.getProfileTeams().then(resp => {
            this.getTasks()
        })

    }

    getTasks = async () => {
        await this.props.getActiveTasks([])
        await this.props.getChecklists(this.props.teamsData)
    }

    onTabClick = (tab) => {
        if (tab === 1) {
            this.setState({
                typeTask: "corrective"
            })
        } else {
            this.setState({
                typeTask: "evolutionary"
            })
        }
        this.active = tab
        this.setState({
            type: Object.keys(tabs).find(k => tabs[k] === this.active)
        })
    }

    render() {
        const { t } = this.props;
        return (
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ibox float-e-margins">
                            <div className="tabs-container">
                                <ul className="nav nav-tabs">
                                    <li className={this.active === tabs.Preventive ? "active" : ""}>
                                        <a data-toggle="tab" onClick={() => this.onTabClick(tabs.Preventive)}>
                                            {t("labels.preventive") + " (" + (this.props.tasksReducer.preventive ? (this.props.tasksReducer.preventive + this.props.checklists.checklists.rows.length) : (0 + this.props.checklists.checklists.rows.length)) + ")"}
                                        </a>
                                    </li>
                                    <li className={this.active === tabs.Corrective ? "active" : ""}>
                                        <a data-toggle="tab" onClick={() => this.onTabClick(tabs.Corrective)}>
                                            {t("labels.corrective") + " (" + (this.props.tasksReducer.corrective ? this.props.tasksReducer.corrective : "0") + ")"}
                                        </a>
                                    </li>
                                    <li className={this.active === tabs.Evolutionary ? "active" : ""}>
                                        <a data-toggle="tab" onClick={() => this.onTabClick(tabs.Evolutionary)}>
                                            {t("historic:labels.evolutionary") + " (" + (this.props.tasksReducer.evolutionary ? this.props.tasksReducer.evolutionary : "0") + ")"}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="ibox-content" style={{ borderTop: '1px solid white' }}>
                                <div className="tab-content">
                                    {
                                        this.active === tabs.Preventive ? <Preventive /> : this.active === tabs.Corrective ? <Corrective /> : <Evolutionary />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    tasksReducer: state.tasks.tasks,
    teamsData: state.teams.profileTeams,
    checklists: state.checklists,
})
const mapDispatchToProps = dispatch => bindActionCreators({ getActiveTasks, getChecklists, getProfileTeams }, dispatch)
export default compose(translate('tasks'), connect(mapStateToProps, mapDispatchToProps))(WorkOrders)
