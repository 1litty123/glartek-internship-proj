import React from 'react';
import Modal from 'react-responsive-modal'
import axios from 'axios'
import { translate } from 'react-i18next'
import Button from '../../common/buttons/button'
import Consts from '../../../utils/consts'

const INITIAL_STATE = {
    //error starts as 'true' because all fields start empty, which disables task creation
    error: true,
    users: []
}

class TaskModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE
    }



    sendCancel = () => {
        this.setState(INITIAL_STATE)
        this.props.onClose()
    }

    checkError = () => {
        this.setState({
            error: !this.refs.name.value || !this.refs.description.value || !this.refs.team.value
        })
    }

    sendData = () => {
        const modalData = {
            title: this.refs.name.value,
            problem: this.refs.description.value,
            assignedToId: this.refs.user && this.refs.user.value ? this.refs.user.value : this.refs.team.value,
            assignedToType: this.refs.user && this.refs.user.value ? "Profile" : "Team",
            severityId: this.props.alarm.severityId ? this.props.alarm.severityId : this.refs.severity.value
        }

        this.props.callback(modalData)

    }

    renderSeverityOptions = () => {
        const data = this.props.severities.sort((a, b) => a.value < b.value) || []
        if (data !== []) {
            return data.map(reg => (
                <option key={reg.id} value={reg.id}>
                    {reg.type}
                </option>
            )
            )
        } else {
            return []
        }
    }

    renderTeamOptions = () => {
        const data = this.props.teams || []
        if (data !== []) {
            return data.map(reg => (
                <option key={reg.id} value={reg.id}>
                    {reg.name}
                </option>
            )
            )
        } else {
            return []
        }
    }

    getTeamUsers = (e) => {
        if (this.props.userRole === 'manager' && this.refs.team && this.refs.team.value !== this.props.userProfile.teamId)
            return
        const teamId = e.target.value
        axios.get(Consts.API_URL + "/Teams/" + teamId + "/member?access_token=" + JSON.parse(localStorage.getItem('_user')).id)
            .then(resp => {
                const _users = resp.data
                this.setState({
                    users: _users
                }, () => this.forceUpdate())
            })
    }

    renderTeamUsers = () => {
        const data = this.state.users || []
        if (data !== []) {
            return data.map(reg => (
                <option key={reg.id} value={reg.id}>
                    {`${reg.name} (username: ${reg.username})`}
                </option>
            )
            )
        } else {
            return []
        }
    }

    render() {
        const { t } = this.props;
        var managerDiffTeam = this.props.userRole === 'manager' && this.refs.team && this.refs.team.value !== this.props.userProfile.teamId
        const alarmSeverity = this.props.severities.filter(sev => this.props.alarm.severityId === sev.id)[0]
        var disableUsers = this.state.users.length === 0 || managerDiffTeam

        return (
            <Modal open={this.props.open} onClose={this.props.onClose} showCloseIcon={false} little>
                <div className="modal-form">
                    <div className="modal-dialog" style={{ margin: 'auto' }}>
                        <div className="modal-body">
                            <div>
                                <div className="row-sm-3">
                                    <h3 className="m-t-none m-b">{"Create New Task"}</h3>
                                    <p>{t("labels.createNewTaskAlarm") + this.props.alarm.name + "'"}</p>
                                </div>
                                <hr />
                                <div className="row-sm-9">
                                    <form role="form" style={{ overflow: 'auto' }} onChange={this.checkError}>
                                        <div className="form-group">
                                            <label>{t("labels.taskName")}</label>
                                            <input ref="name" placeholder={t("labels.taskName")} className="form-control" required />
                                        </div>
                                        <div className="form-group">
                                            <label>{t("labels.problemDescription")}</label>
                                            <textarea ref="description" placeholder={t("labels.problemDescription")} className="form-control" style={{ resize: 'vertical' }} />
                                        </div>
                                        <div className="hr-line-dashed" />
                                        <div className="form-group">
                                            <div className="col-sm-4">
                                                <label>{t("labels.team")}</label>
                                                <select ref="team" className="form-control m-b" onChange={(e) => this.props.userRole === 'operator' ? null : this.getTeamUsers(e)}>
                                                    <option disabled selected value={null} />
                                                    {this.renderTeamOptions()}
                                                </select>
                                            </div>
                                            {this.props.userRole === 'operator' ?
                                                <div className="col-sm-4" /> :
                                                <div className="col-sm-4" >
                                                    <label>{t("labels.user")}</label>
                                                    <select ref="user" className="form-control m-b" disabled={disableUsers}>
                                                        <option />
                                                        {this.renderTeamUsers()}
                                                    </select>
                                                </div>
                                            }
                                            <div className="col-sm-4">
                                                <label>{t("labels.severity")}</label>
                                                {!this.props.alarm.severityId ?
                                                    <select ref="severity" className="form-control m-b">
                                                        {this.renderSeverityOptions()}
                                                    </select>
                                                    :
                                                    <p className="form-control-static">{alarmSeverity ? alarmSeverity.type : "Undefined"}</p>
                                                }
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ float: 'right' }}>
                        <Button onClick={() => this.sendCancel()} color="default" label={t("buttons.cancel")} />
                        &nbsp;
                        <Button onClick={() => this.state.error ? null : this.sendData()} color="primary" label={t("buttons.create")} extra={this.state.error ? "disabled" : ""} />
                    </div>
                </div>
            </Modal>
        )
    }
}

export default translate('tasks')(TaskModal)
