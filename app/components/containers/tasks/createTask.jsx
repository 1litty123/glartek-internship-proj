import React from 'react';
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators, compose } from 'redux'
import axios from 'axios'
import moment from 'moment'
import 'icheck/skins/all.css'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/fontawesome-free-solid'

import Button from '../../common/buttons/button'
import Consts from '../../../utils/consts'
import { getTeamData } from '../teams/teamActions'
import { getSeverities } from '../severities/severityActions'
import { createTask, saveTask } from './taskActions'
import { getProfile } from '../../layouts/layoutActions'
import { getProfileRole } from '../administration/profiles/profileActions'
import { getProfileTeams } from '../profile/profileActions'
import { getElements } from '../plant/plantManagerActions'
import FilesModal from '../files/filesModal'
import { addFiles } from '../files/fileActions'
import { translate } from 'react-i18next';
import { nextInvocation } from '../crons/cronActions'

import LoadCron from '../crons/fragments/loadCronFrag'
import ElementChoice from '../../common/elementChoice/elementChoice'

const INITIAL_STATE = {
    error: true,
    users: [],
    elements: [],
    periodic: false,
    period: null,
    title: "",
    element: "",
    elementType: "",
    type: "corrective",

    openFiles: false,

    estimation: {
        label: "Please pick a period and values for the estimated beginning and the expected duration fields, to get an estimation for each date values.",
        color: "text-navy"
    }
}

class CreateTask extends React.Component {

    constructor(props) {
        super(props)

        this.state = INITIAL_STATE
        this.TIME_FORMAT_DAY = "YYYY-MM-DD"
        this.TIME_FORMAT_HOUR = "kk:mm:ss"
        this.TIME_FORMAT = "YYYY-MM-DD kk:mm:ss"
        this.elementTypes = ["Area", "System", "Asset", "Sub_Asset"]
        this.times = [
            {
                label: 'minute(s)',
                ratio: 1
            },
            {
                label: 'hour(s)',
                ratio: 60
            },
            {
                label: 'day(s)',
                ratio: 1440 /* 60 * 24 */
            }
        ]
        this.currentFiles = []

        this.titleRef = null
        this.problemRef = null
        this.teamIdRef = null
        this.userIdRef = null
        this.elementTypeRef = null
        this.elementIdRef = null
        this.severityIdRef = null
        this.durationRef = null
        this.beginningRef = null

        this.teams = []

    }

    componentDidMount() {
        this.props.getTeamData()
        this.props.getSeverities()
        this.props.getProfile(JSON.parse(localStorage.getItem('_user')))
        this.props.getProfileRole(JSON.parse(localStorage.getItem('_user')).userId)

        this.props.getProfileTeams()
            .then(teams => this.teams = teams.data)

    }

    checkError = () => {
        this.setState({
            error: !this.titleRef.value
                || !this.problemRef.value
                || !this.teamIdRef.value
                || !this.state.element
                || !this.state.type
                || (this.state.periodic ? !this.state.period : false)
                || !this.durationRef || this.durationRef.value === ""
                || !this.beginningRef || this.beginningRef.value === ""
        })
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
        const data = this.props.teamsData || []
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

    renderTypeOptions = () => {
        const data = this.elementTypes
        if (data !== []) {
            return data.map(reg => (
                <option key={reg} value={reg}>
                    {reg.replace('_', ' ')}
                </option>
            )
            )
        } else {
            return []
        }
    }

    renderTimeOptions = () => {
        this.times = [
            {
                label: this.props.t("createTask:labels.minute"),
                ratio: 1
            },
            {
                label: this.props.t("createTask:labels.hour"),
                ratio: 60
            },
            {
                label: this.props.t("createTask:labels.day"),
                ratio: 1440 /* 60 * 24 */
            }
        ]
        const data = this.times
        if (data !== []) {
            return data.map(reg => (
                <option key={reg.label} value={reg.label}>
                    {reg.label}
                </option>
            )
            )
        } else {
            return []
        }
    }

    getTeamUsers = () => {
        const filterTeam = this.teams.filter(t => t.id === this.teamIdRef.value)
        if (this.state.periodic || (this.props.userRole === 'manager' && this.teamIdRef && filterTeam.length === 0))
            return
        const teamId = this.teamIdRef.value
        axios.get(Consts.API_URL + "/Teams/" + teamId + "/profile?access_token=" + JSON.parse(localStorage.getItem('_user')).id)
            .then(resp => {
                const users = resp.data
                this.setState({ users }, () => {
                    this.checkError()
                    this.forceUpdate()
                })
            })
    }

    getElements = async (value) => {
        const type = value.replace('_', '') + "s"
        try {
            const elements = await this.props.getElements(type)
            this.setState({
                elementType: value,
                elements: elements.data
            }, () => this.forceUpdate())
        } catch (err) {
            console.log(err)
        }
    }

    renderTeamUsers = () => {
        const data = this.state.users || []
        if (data.length > 0) {
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

    renderElementOptions = () => {
        const data = this.state.elements || []
        if (data.length > 0) {
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

    renderPeriod = () => {
        this.setState({
            periodic: !this.state.periodic
        }, () => {
            this.checkError()
            if (this.state.periodic)
                this.setState({
                    users: []
                })
            else {
                if (this.teamIdRef.value)
                    this.getTeamUsers()
            }
        })
    }

    setPeriodPref = (event, value) => {
        this.setState({
            newPeriod: value,
            period: null
        }, () => {
            this.checkError()
        })
    }

    getPeriodData = (period) => {
        this.setState({
            period: period
        }, () => {
            this.checkError()
            this.calcEstimation()
        })
    }

    resetPeriod = () => {
        this.setState({
            period: null
        }, () => {
            this.checkError()
        })
    }

    onOpenFilesModal = () => {
        this.setState({
            openFiles: true
        })
    }
    onCloseFilesModal = () => {
        this.setState({
            openFiles: false
        })
    }
    onAcceptFilesModal = (files) => {
        this.currentFiles = files
    }

    getTaskFormInfo = () => {
        let taskData = {
            title: this.titleRef ? this.titleRef.value : "",
            problem: this.problemRef ? this.problemRef.value : "",
            severityId: this.severityIdRef ? this.severityIdRef.value : "",
            elementId: this.state.element.id,
            elementType: this.state.elementType,
            assignedToId: this.userIdRef && this.userIdRef.value ? this.userIdRef.value : this.teamIdRef.value,
            assignedToType: this.state.periodic ? 'Team' : (this.userIdRef && this.userIdRef.value ? 'Profile' : 'Team'),
            type: this.state.type
        }

        const timesED = this.times.filter(t => this.timesEDRef && t.label === this.timesEDRef.value)[0]
        const timesEB = this.times.filter(t => this.timesEBRef && t.label === this.timesEBRef.value)[0]
        taskData.estimatedDurationMinutes = this.durationRef.value && this.durationRef.value < 0 ? 0 : this.durationRef.value * timesED.ratio
        taskData.expectedBeginning = this.durationRef.value && this.beginningRef.value < 0 ? 0 : this.beginningRef.value * timesEB.ratio

        if (this.state.periodic) {
            taskData.active = 'true'
            taskData.predefinedTimeId = this.state.period ? this.state.period.id : ""
        }

        return taskData
    }

    createTask = async () => {
        try {
            const taskData = this.getTaskFormInfo()

            const catalog = await this.props.createTask(taskData)
            if (this.currentFiles.length > 0)
                this.props.addFiles("TaskCatalogs", null, catalog.data.id, null, this.currentFiles, false)

            swal(this.props.t("createTask:swals.createTaskSuccess"), {
                icon: "success"
            })
        } catch (err) {
            swal(this.props.t("createTask:swals.createTaskError"), {
                icon: "warning"
            })
        }
    }

    /* ************* */

    calcEstimation = () => {
        if ((this.state.type === "preventive" && !this.state.period) || !this.durationRef || this.durationRef.value === "" || !this.beginningRef || this.beginningRef.value === "")
            this.setState({
                estimation: {
                    label: "Please pick a period and values for the estimated beginning and the expected duration fields, to get an estimation for each date values.",
                    color: "text-navy"
                }
            }, () => this.forceUpdate())
        else if (this.state.type === "corrective" || this.state.type === "evolutionary") {
            const timesED = this.times.filter(t => this.timesEDRef && t.label === this.timesEDRef.value)[0]
            const timesEB = this.times.filter(t => this.timesEBRef && t.label === this.timesEBRef.value)[0]
            const duration = this.durationRef.value
            const beginning = this.beginningRef.value
            this.setState({
                estimation: {
                    label: "This task should be started, at most, " + beginning + " " + timesEB.label +
                        " after it's created, before becoming overdue. This task should be completed in " + duration + " " + timesED.label + ".",
                    color: ""
                }
            }, () => this.forceUpdate())
        }
        else {
            const timesED = this.times.filter(t => this.timesEDRef && t.label === this.timesEDRef.value)[0]
            const timesEB = this.times.filter(t => this.timesEBRef && t.label === this.timesEBRef.value)[0]
            const duration = this.durationRef.value
            const beginning = this.beginningRef.value

            this.props.nextInvocation(this.state.period.id)
                .then(resp => {
                    const day = moment(resp.data.date).local().format(this.TIME_FORMAT_DAY)
                    const hour = moment(resp.data.date).local().format(this.TIME_FORMAT_HOUR)
                    this.setState({
                        estimation: {
                            label: "Next invocation will be on " + day + ", at " + hour + ", and is estimated to be done " + beginning + " " +
                                timesEB.label + " after it's invocated, before becoming overdue. This task should be completed in " + duration + " " + timesED.label + ".",
                            color: ""
                        }
                    })
                }, () => this.forceUpdate())
        }
    }

    /* ************* */

    redirect = () => {
        swal({
            title: this.props.t("createTask:swals.redirectTitle"),
            text: this.props.t("createTask:swals.redirectText"),
            icon: "warning",
            buttons: {
                /* save: {
                    text: this.props.t("createTask:swals.saveBtn"),
                    value: "save"
                }, */
                redirect: {
                    text: this.props.t("createTask:swals.continueBtn"),
                    value: "redirect"
                },
                cancel: {
                    text: this.props.t("createTask:swals.cancelBtn"),
                    value: "cancel"
                }
            },
            dangerMode: false,
        }).then((value) => {
            switch (value) {
                /* case "save":
                    const taskData = this.saveInfo()
                    const data = {
                        task: taskData,
                        savedDate: moment()
                    }
                    this.props.saveTask(data)
                    swal("Form saved")
                        .then(val => hashHistory.push("/cronManager")) */
                case "redirect":
                    hashHistory.push("/cronManager")
                    break
                case "cancel":
                    return
            }
        })
    }

    /*     loadForm = () => {
            this.fillInfo(this.props.savedTask.task)
        } */

    /*     fillInfo = (info) => {
            console.log(info)
            this.titleRef.value = info.title
            this.problemRef.value = info.problem
            this.teamIdRef.value = info.teamId
            this.severityIdRef.value = info.severityId
            this.userIdRef.value = info.userId
            this.durationRef.value = info.estimatedDurationMinutes
            this.beginningRef.value = info.expectedBeginning
            this.timesEDRef.value = info.timesED.label
            this.timesEBRef.value = info.timesEB.label
            this.props.getElements(info.elementType + "s")
                .then(resp => {
                    this.setState({
                        periodic: info.periodic
                    }, () => {
                    })
                })
        } */

    /*     saveInfo = () => {
            const timesED = this.times.filter(t => this.timesEDRef && t.label === this.timesEDRef.value)[0]
            const timesEB = this.times.filter(t => this.timesEBRef && t.label === this.timesEBRef.value)[0]
    
            return {
                title: this.titleRef ? this.titleRef.value : "",
                problem: this.problemRef ? this.problemRef.value : "",
                teamId: this.teamIdRef && this.teamIdRef.value ? this.teamIdRef.value : "",
                userId: this.userIdRef && this.userIdRef.value ? this.userIdRef.value : "",
                elementType: this.state.type,
                elementId: this.state.element.id,
                severityId: this.severityIdRef ? this.severityIdRef.value : "",
                periodic: this.state.periodic,
                estimatedDurationMinutes: this.durationRef ? this.durationRef.value : "",
                expectedBeginning: this.beginningRef ? this.beginningRef.value : "",
                timesED: timesED,
                timesEB: timesEB
            }
    
        } */

    /* ************* */

    updateElement = (element, elementType) => {
        this.setState({ element, elementType }, () => this.checkError())
    }

    render() {
        const css = {
            load: {
                marginLeft: 20,
                color: "#22b597",
                fontSize: 12,
                fontWeight: 500
            }
        }

        const filterTeam = this.teams.filter(t => t.id === this.teamIdRef.value)
        var managerDiffTeam = this.props.userRole === 'manager' && this.teamIdRef && filterTeam.length === 0
        var disableUsers = this.state.users.length === 0 || managerDiffTeam
        const { t } = this.props;

        return (
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ibox float-e-margins">

                            <div className="ibox-title">
                                <h5>
                                    {t("createTask:labels.titleGen")}
                                </h5>
                                {/* this.props.savedTask ?
                                    <div className="b-r">
                                        <a onClick={() => this.loadForm()} style={css.load}>
                                            <FontAwesomeIcon icon={faDownload} /> {t("createTask:labels.loadSaveForm")} <br />
                                            <small style={{ marginLeft: 20 }}>{t("createTask:labels.saveOn") + this.props.savedTask.savedDate.format(this.TIME_FORMAT)}</small>
                                        </a>
                                    </div>
                                    : null */
                                }
                            </div>
                            <div className="ibox-content">
                                <form className="form-horizontal" onChange={this.checkError}>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">
                                            {t("createTask:labels.title")}
                                        </label>
                                        <div className="col-sm-10">
                                            <input ref={ref => this.titleRef = ref} className="form-control" type="text" placeholder={t("createTask:placeholder.title")} />
                                            <span className="help-block m-b-none">
                                                {t("createTask:spans.title")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">
                                            {t("createTask:labels.problem")}
                                        </label>
                                        <div className="col-sm-10">
                                            <textarea
                                                ref={ref => this.problemRef = ref}
                                                className="form-control"
                                                placeholder={t("createTask:placeholder.problem")}
                                                style={{ resize: 'vertical', maxHeight: '500px', minHeight: '50px' }}
                                            />
                                            <span className="help-block m-b-none">
                                                {t("createTask:spans.problem")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hr-line-dashed" />
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">{t("createTask:labels.team")}</label>
                                        <div className="col-sm-4">
                                            <select ref={ref => this.teamIdRef = ref} className="form-control m-b" onChange={this.getTeamUsers}>
                                                <option disabled selected value={null} />
                                                {this.renderTeamOptions()}
                                            </select>
                                            <span className="help-block m-b-none">
                                                {t("createTask:spans.team")}
                                            </span>
                                        </div>
                                        {this.props.userRole === 'operator' ? null :
                                            <div>
                                                <label className="col-sm-2 control-label">{t("createTask:labels.user")}</label>
                                                <div className="col-sm-4">
                                                    <select ref={ref => this.userIdRef = ref} className="form-control m-b" disabled={disableUsers}>
                                                        <option />
                                                        {!managerDiffTeam ? this.renderTeamUsers() : null}
                                                    </select>
                                                    {managerDiffTeam ?
                                                        <span className="text-navy help-block m-b-none">
                                                            {t("createTask:spans.user")}
                                                        </span>
                                                        :
                                                        <div>
                                                            <span className="help-block m-b-none" style={{ display: !this.state.periodic ? "" : "none" }}>
                                                                {t("createTask:spans.renderTeamUsersTrue")}
                                                            </span>
                                                            <span className="text-navy help-block m-b-none" style={{ display: !this.state.periodic ? "none" : "" }}>
                                                                {t("createTask:spans.renderTeamUsersFalse")}
                                                            </span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className="hr-line-dashed" />
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">{t("createTask:labels.element")}</label>
                                        <div className="col-sm-10">
                                            <ElementChoice
                                                callback={this.updateElement}
                                            />
                                        </div>
                                    </div>
                                    <div className="hr-line-dashed" />
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">{t("createTask:labels.severity")}</label>
                                        <div className="col-sm-4">
                                            <select ref={ref => this.severityIdRef = ref} className="form-control m-b">
                                                {this.renderSeverityOptions()}
                                            </select>
                                            <span className="help-block m-b-none">
                                                {t("createTask:spans.severity")}
                                            </span>
                                        </div>
                                    </div>
                                    {this.props.userRole == 'operator' ? <div /> :
                                        <div>
                                            <div className="hr-line-dashed" />
                                            <div className="form-group">
                                                <label className="col-sm-2 control-label">{t("createTask:labels.type")}</label>
                                                <div className="col-sm-4">
                                                    <select onChange={(e) => (e.target.value === "preventive" ? (this.renderPeriod(), this.state.periodic = true, this.setState({ type: e.target.value, estimation: INITIAL_STATE.estimation }, this.checkError)) : (this.state.periodic = false, this.setState({ type: e.target.value, estimation: INITIAL_STATE.estimation }, this.checkError)))} className="form-control m-b">
                                                        <option key={"0"} value={"corrective"}>
                                                            {"Corrective"}
                                                        </option>
                                                        <option key={"1"} value={"preventive"}>
                                                            {"Preventive"}
                                                        </option>
                                                        <option key={"2"} value={"evolutionary"}>
                                                            {"Evolutionary"}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="hr-line-dashed" />
                                    <div className="form-group">
                                        <label className={"col-sm-12 control-label " + this.state.estimation.color}>
                                            {this.state.estimation.label}
                                        </label>
                                    </div>
                                    <div className="hr-line-dashed" />
                                    <div className="form-group" onChange={this.calcEstimation}>
                                        <label className="col-sm-2 control-label">
                                            {t("createTask:labels.estimatedBeginning")}
                                        </label>
                                        <div className="col-sm-4">
                                            <div className="col-sm-6" style={{ paddingLeft: 0 }}>
                                                <input
                                                    ref={ref => this.beginningRef = ref}
                                                    className="form-control"
                                                    placeholder={t("createTask:placeholder.estimatedBeginning")}
                                                    type="number" min="0"
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <select ref={ref => this.timesEBRef = ref} className="form-control m-b">
                                                    {this.renderTimeOptions()}
                                                </select>
                                            </div>
                                            <span className="help-block m-b-none">
                                                {t("createTask:spans.estimatedBeginning")}
                                            </span>
                                        </div>
                                        <label className="col-sm-2 control-label">
                                            {t("createTask:labels.estimatedDuration")}
                                        </label>
                                        <div className="col-sm-4">
                                            <div className="col-sm-6" style={{ paddingLeft: 0 }}>
                                                <input
                                                    ref={ref => this.durationRef = ref}
                                                    className="form-control"
                                                    placeholder={t("createTask:placeholder.estimatedDuration")}
                                                    type="number" min="0"
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <select ref={ref => this.timesEDRef = ref} className="form-control m-b">
                                                    {this.renderTimeOptions()}
                                                </select>
                                            </div>
                                            <span className="help-block m-b-none">
                                                {t("createTask:spans.estimatedDuration")}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: !this.state.periodic ? "none" : "" }}>
                                        <div className="hr-line-dashed" />
                                        <Button onClick={() => this.redirect()} color="primary" label={t("createTask:buttons.createPeriod")} size="lg" />
                                        <div>
                                            <LoadCron callback={this.getPeriodData} />
                                        </div>
                                    </div>
                                    <div className="hr-line-dashed" />
                                    <div className="form-group" style={{ marginLeft: '5px' }}>
                                        <Button
                                            onClick={() => this.state.error ? null : this.createTask()}
                                            color="primary"
                                            label={t("createTask:buttons.createTask")}
                                            size="lg"
                                            extra={this.state.error ? "disabled" : ""}
                                        />
                                        &nbsp;
                                        <Button onClick={() => this.onOpenFilesModal()} label={t("createTask:buttons.files")} size="lg" />
                                    </div>
                                    {this.state.openFiles ?
                                        <FilesModal
                                            open={this.state.openFiles}
                                            onClose={this.onCloseFilesModal}
                                            disableBackend={true}
                                            callback={this.onAcceptFilesModal}
                                            files={this.currentFiles}
                                            editable={true}
                                        />
                                        : null
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )



    }

}

const mapStateToProps = state => ({
    userProfile: state.profile.profile,
    userRole: state.profile.role,
    teamsData: state.teams.teams,
    severities: state.severities.severities,
})
const mapDispatchToProps = dispatch => bindActionCreators({
    getTeamData, getSeverities, createTask, getProfile,
    getProfileRole, getProfileTeams, getElements, addFiles, nextInvocation, saveTask
}, dispatch)
export default compose(translate("createTask"), connect(mapStateToProps, mapDispatchToProps))(CreateTask)

