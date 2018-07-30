import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import Tooltip from 'react-tooltip'
import { bindActionCreators, compose } from 'redux'
import axios from 'axios'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faStopwatch, faExclamationTriangle, faUser, faUsers } from '@fortawesome/fontawesome-free-solid'
import moment from 'moment'
import { translate } from 'react-i18next'
import Button from '../../../common/buttons/button'
import Span from '../../../common/icons/span'
import Consts from '../../../../utils/consts'
import Event from './../workOrderListFragments/eventFrag'
import FilesModal from '../../files/filesModal'

import { getHistoryTasks } from '../taskActions'
import { countFiles } from '../../files/fileActions'

class HistoryTasks extends React.Component {

    constructor(props) {
        super(props)

        this.access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
        this.TIME_FORMAT = "YYYY-MM-DD kk:mm:ss"

        this.state = {
            history: {
                currentData: [],
                loading: true,
                totalPages: null,
                expanded: {},
                currentAlarm: this.props.t("labels.undefined"),
                currentElem: this.props.t("labels.undefined"),
                currentSolutionFiles: [],
                currentProblemFiles: []
            },

            openProblemFiles: false,
            openSolutionFiles: false,
            openCommonFiles: false,
            countProblemFiles: -1,
            countSolutionFiles: -1,
            countCommonFiles: -1,
            selectedTask: null,

            tablestate: {
                page: 0,
                pageSize: 10,
                sorted: null,
                filtered: null
            }
        }
    }

    getTeam = (teamId) => {
        let result = this.props.teamsData.filter((p) => p.id === teamId)
        if (result.length > 0)
            return result[0].name
        return "-"
    }

    getSeverity = (severityId) => {
        let result = this.props.severities.filter((p) => p.id === severityId)
        if (result.length > 0)
            return result[0]
        return "-"
    }

    requestHistoryTasksData = async (pageSize, page, sorted, filtered) => {
        try {
            return await this.props.getHistoryTasks(pageSize, page, sorted, filtered)
        } catch (err) {
            return err
        }
    }

    fetchHistoryTasksData = (state, instance) => {
        this.setState({
            history: {
                ...this.state.history,
                loading: true
            }
        }, () => {
            this.requestHistoryTasksData(state.pageSize, state.page, state.sorted, state.filtered)
                .then(resp => {
                    this.setState({
                        history: {
                            ...this.state.history,
                            currentData: resp.rows,
                            totalPages: resp.pages,
                            loading: false
                        },
                        tablestate: {
                            pageSize: state.pageSize,
                            page: state.page,
                            sorted: state.sorted,
                            filtered: state.filtered

                        }
                    })
                })
        })
    }

    onOpenProblemFilesModal = (task) => {
        this.setState({
            openProblemFiles: true,
            selectedTask: task
        })
    }
    onCloseProblemFilesModal = () => {
        this.setState({
            openProblemFiles: false,
            selectedTask: null
        })
    }

    onOpenSolutionFilesModal = (task) => {
        this.setState({
            openSolutionFiles: true,
            selectedTask: task
        })
    }
    onCloseSolutionFilesModal = () => {
        this.setState({
            openSolutionFiles: false,
            selectedTask: null
        })
    }

    onOpenCommonFilesModal = (task) => {
        this.setState({
            openCommonFiles: true,
            selectedTask: task
        })
    }
    onCloseCommonFilesModal = () => {
        this.setState({
            openCommonFiles: false,
            selectedTask: null
        })
    }

    render() {
        const { t } = this.props;
        const { history } = this.state

        const historyColumns = [
            {
                Header: t("tables:headers.periodic"),
                accessor: 'taskCatalog.predefinedTimeId',
                maxWidth: 50,
                sortable: false,
                /* filterable: true, */
                filterMethod: (filter, row) => {
                    switch (filter.value) {
                        case 'yes':
                            return row.taskCatalog.predefinedTimeId
                        case 'no':
                            return !row.taskCatalog.predefinedTimeId
                    }
                    return true
                },
                Filter: ({ filter, onChange }) => (
                    <select style={{ width: 60 }} onChange={event => onChange(event.target.value)} value={filter}>
                        <option>All</option>
                        <option value='yes'>Yes</option>
                        <option value='no'>No</option>
                    </select>
                ),
                Cell: row => (
                    <div style={{ visibility: row.original.taskCatalog.predefinedTimeId ? 'visible' : 'hidden' }}>
                        <FontAwesomeIcon icon={faStopwatch} />
                    </div>
                )
            },
            {
                Header: t("tables:headers.alarm"),
                accessor: 'alarmCatalogId',
                maxWidth: 50,
                sortable: false,
                /* filterable: true, */
                filterMethod: (filter, row) => {
                    switch (filter.value) {
                        case 'with':
                            return row.alarmCatalogId
                        case 'without':
                            return !row.alarmCatalogId
                    }
                    return true
                },
                Filter: ({ filter, onChange }) => (
                    <select style={{ width: 60 }} onChange={event => onChange(event.target.value)} value={filter}>
                        <option>All</option>
                        <option value='with'>With</option>
                        <option value='without'>Without</option>
                    </select>
                ),
                Cell: row => (
                    <div style={{ visibility: row.original.taskCatalog.alarmCatalogId ? 'visible' : 'hidden' }}>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </div>
                )
            },
            {
                Header: t("tables:headers.severity"),
                accessor: 'severity',
                maxWidth: 70,
                sortable: false,
                /* filterable: true, */
                filterMethod: (filter, row) => {
                    return String(row[filter.id].type.toLowerCase()).indexOf(filter.value.toLowerCase()) != -1
                },
                sortMethod: (a, b) => {
                    return a.value > b.value ? 1 : -1
                },
                Cell: row => {
                    const sev = this.getSeverity(row.original.taskCatalog.severityId)
                    return (
                        <div>
                            <Span class="label fa-2x" color={sev.color} text={sev.type} />
                        </div>
                    )
                }
            },
            {
                Header: t("tables:headers.title"),
                accessor: 'title',
                /* filterable: true, */
                filterMethod: (filter, row) => {
                    return String(row[filter.id].toLowerCase()).indexOf(filter.value.toLowerCase()) != -1
                },
                Cell: row => (
                    <div>
                        <b>{row.original.taskCatalog.title}</b>
                    </div>
                )
            },
            {
                Header: t("tables:headers.element"),
                maxWidth: 75,
                /* filterable: true, */
                filterMethod: (filter, row) => {
                    return String(row[filter.id].toLowerCase()).indexOf(filter.value.toLowerCase()) != -1
                },
                Cell: row => (
                    <div> {/* data-tip={row.original.elementType} data-type="light" data-effect="float">
                    <Span class="label" color="#4F645A" text={row.original.elementType} />
                    <Tooltip /> */}
                        {row.original.taskCatalog.elementType}
                    </div>
                )
            },
            {
                Header: t("tables:headers.responsible"),
                accessor: 'assignedToId',
                width: 140,
                /* filterable: true, */
                filterMethod: (filter, row) => {
                    //since there's no accessor for the 'assignedToType' field, we must use the original reference, kept inside the '_original' element
                    switch (filter.value) {
                        case 'Team':
                            return row._original.taskCatalog.assignedToType === "Team"
                        case 'Profile':
                            return row._original.taskCatalog.assignedToType === "Profile"
                    }
                    return true
                },
                Filter: ({ filter, onChange }) => (
                    <select style={{ width: 60 }} onChange={event => onChange(event.target.value)} value={filter}>
                        <option>All</option>
                        <option value='Team'>Team</option>
                        <option value='Profile'>Profile</option>
                    </select>
                ),
                Cell: row => (
                    <div>
                        <FontAwesomeIcon icon={row.original.taskCatalog.assignedToType === "Team" ? faUsers : faUser} />
                        &nbsp;
                    {row.original.taskCatalog.assignedToType === "Team" ? this.getTeam(row.original.taskCatalog.assignedToId) : this.props.userProfile.username}
                    </div>
                )
            },
            {
                Header: t("tables:headers.state"),
                accessor: 'state',
                maxWidth: 70,
                /* filterable: true, */
                filterMethod: (filter, row) => {
                    switch (filter.value) {
                        case 'cancelled by system':
                            return row.state === "cancelled by system"
                        case 'done':
                            return row.state === "done"
                        case 'not done':
                            return row.state === "not done"
                    }
                    return true
                },
                Filter: ({ filter, onChange }) => (
                    <select style={{ width: 60 }} onChange={event => onChange(event.target.value)} value={filter}>
                        <option>All</option>
                        <option value='pending'>Pending</option>
                        <option value='wip'>WIP</option>
                        <option value='paused'>Paused</option>
                        <option value='done'>Done</option>
                        <option value='notdone'>Not Done</option>
                    </select>
                ),
                Cell: row => {
                    let pbType = "progress-bar progress-bar-", divStyle = "progress "
                    switch (row.original.state) {
                        case "done":
                            pbType += ""
                            break
                        case "cancelled by system":
                            pbType += "warning"
                            break
                        case "not done":
                            pbType += "danger"
                            break
                    }

                    return (
                        <div
                            style={{ width: 40, margin: '0 auto', align: 'center' }}
                            className={divStyle}>
                            <div
                                style={{ width: 40 }}
                                aria-valuemax="100"
                                aria-valuenow="100"
                                role="progressbar"
                                className={pbType}
                                data-tip={row.original.state}
                                data-type="light"
                                data-effect="float"
                            >
                                <Tooltip />
                            </div>
                        </div>
                    )
                }
            },
            {
                Header: t("tables:headers.createdBy"),
                accessor: 'createdBy',
                /* filterable: true, */
                width: 130,
                Cell: row => (
                    <div>
                        {row.original._events.filter(e => e.eventName === "created")[0].byId}
                    </div>
                )
            }
        ]

        const css = {
            button: {
                width: 80,
                align: 'center'
            },
            hidden: {
                display: 'none'
            },
            smallText: {
                height: 150,
                overflow: 'auto'
            },
            extra: {
                height: 50,
                overflow: 'auto'
            },
            descDefault: {
                height: 225,
                overflow: 'auto'
            },
            descBig: {
                height: 200,
                overflow: 'auto'
            },
            divDefault: {
                height: 500
            },
            center: {
                width: 450,
                bottom: '50%',
                top: '25%',
                right: '50%',
                left: '25%',
                position: 'absolute',
                display: 'inline-block',
                align: 'center',
                WebkitTransform: "translate(-15%,0)"
            }
        }

        const getAlarm = (id) => {
            axios.get(Consts.API_URL + "/AlarmsInstance/" + id + "?" + this.access_token)
                .then(instanceData => {
                    if (instanceData.data) {
                        axios.get(Consts.API_URL + "/AlarmsCatalog/" + instanceData.data.alarmCatalogId + "?" + this.access_token)
                            .then(alarmData => {
                                this.setState({
                                    history: {
                                        ...this.state.history,
                                        currentAlarm: alarmData ? alarmData.data.name : t("labels.noAlarmFound")
                                    }
                                }, () => {
                                    return
                                })
                            })
                    }
                }).catch(err => {
                    console.log(err)
                })
        }

        const getElement = (id, type) => {
            axios.get(Consts.API_URL + "/" + type + "s/" + id + "?" + this.access_token)
                .then(elementData => {
                    if (elementData.data) {
                        this.setState({
                            history: {
                                ...this.state.history,
                                currentElem: elementData.data.name
                            }
                        }, () => {
                            return
                        })
                    }
                })
        }

        const renderEvents = (instance) => {
            return instance._events.map((event, key) => (
                <Event key={key} event={event} instanceId={instance.id} context={"TaskInstances"} />
            ))
        }

        const countProblemFiles = (obj) => {
            this.props.countFiles("TaskInstances", null, obj.id, null, { key: 'isSolution', value: false })
                .then(resp => {
                    this.setState({
                        countProblemFiles: resp.data.count
                    })
                })
        }

        const countCommonFiles = (obj) => {
            this.props.countFiles("TaskCatalogs", null, obj.id, null, { key: 'isSolution', value: false })
                .then(resp => {
                    this.setState({
                        countCommonFiles: resp.data.count
                    })
                })
        }

        const countSolutionFiles = (obj) => {
            this.props.countFiles("TaskInstances", null, obj.id, null, { key: 'isSolution', value: true })
                .then(resp => {
                    this.setState({
                        countSolutionFiles: resp.data.count
                    })
                })
        }

        return (
            <div>
                <ReactTable
                    manual
                    data={history.currentData}
                    columns={historyColumns}
                    loading={history.undefined}
                    pages={history.totalPages}
                    expanded={history.expanded}
                    onFetchData={this.fetchHistoryTasksData}
                    defaultPageSize={10}
                    className="-striped -highlight text-center "
                    collapseOnDataChange={false}
                    collapseOnPageChange={true}
                    collapseOnSortingChange={true}
                    previousText={t("tables:buttons.previous")}
                    nextText={t("tables:buttons.next")}
                    pageText={t("tables:texts.page")}
                    ofText={t("tables:texts.of")}
                    noDataText={t("tables:texts.noData")}
                    rowsText={t("tables:texts.rows")}
                    onExpandedChange={(newExpanded, index, event) => {
                        this.setState({
                            history: {
                                ...this.state.history,
                                expanded: { [index]: this.state.history.expanded[index] ? false : true },
                                currentElem: t("labels.undefined"),
                                currentAlarm: t("labels.undefined")
                            }
                        })
                    }}
                    SubComponent={row => {
                        if (row.original.alarmCatalogId && this.state.history.currentAlarm === t("labels.undefined"))
                            getAlarm(row.original.alarmCatalogId)
                        if (this.state.history.currentElem === t("labels.undefined"))
                            getElement(row.original.taskCatalog.elementId, row.original.taskCatalog.elementType)
                        if (this.state.countProblemFiles === -1 || this.state.countCommonFiles === -1 || this.state.countSolutionFiles === -1) {
                            countSolutionFiles(row.original)
                            countProblemFiles(row.original)
                            countCommonFiles(row.original.taskCatalog)
                        }

                        const comment = row.original._events.length > 0 ? row.original._events[row.original._events.length - 1] : null

                        return (
                            <div className="text-left ibox-content">
                                <div ref="problem" className="col-lg-3 row-lg-2 b-r" style={css.divDefault}>
                                    <div className="row-lg-1">
                                        <h2>{t("labels.problem")}</h2>
                                    </div>
                                    <div className="row-lg-1">
                                        <h3>{t("labels.description")}</h3>
                                    </div>
                                    <div style={!row.original.alarmCatalogId ? css.descBig : css.descDefault}>
                                        {row.original.taskCatalog.problem}
                                    </div>
                                    <div>
                                        <div className="hr-line-dashed" />
                                        <div className="row-lg-2">
                                            <h4>{row.original.taskCatalog.elementType || "Type"}</h4>
                                        </div>
                                        <div style={css.extra}>
                                            {this.state.history.currentElem}
                                        </div>
                                        {
                                            !row.original.alarmCatalogId ? null :
                                                <div>
                                                    <div className="row-lg-2">
                                                        <h4>{t("labels.alarm")}</h4>
                                                    </div>
                                                    <div style={css.extra}>
                                                        {this.state.history.currentAlarm}
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className="col-lg-6 row-lg-2 b-r " style={css.divDefault}>
                                        <div className="row-lg-2">
                                            <h2>{t("labels.outcome")}</h2>
                                        </div>
                                        <div className="row-lg-2">
                                            <h3>{t("labels.description")}</h3>
                                        </div>
                                        <div className="row-lg-4" style={css.smallText}>
                                            {comment ? comment.reason : "-"}
                                        </div>
                                        <br />
                                        <div className="row-lg-2">
                                            <h3>{t("labels.comment")}</h3>
                                        </div>
                                        <div className="row-lg-4" style={css.smallText}>
                                            {comment ? comment.description : "-"}
                                        </div>
                                    </div>
                                </div>
                                <div className={"col-lg-3 row-lg-2 m-b-lg"} style={{ height: 500, width: '100% + 10px', overflow: 'auto' }}>
                                    <div id="vertical-timeline" className="vertical-container dark-timeline no-margins">
                                        {renderEvents(row.original)}
                                    </div>
                                </div>
                                <div className="ibox float-e-margins">
                                    <div className="col-lg-3 b-r">
                                        <Button
                                            size="lg"
                                            color="default"
                                            label={t("buttons.files") + this.state.countProblemFiles + ")"}
                                            onClick={() => this.onOpenProblemFilesModal(row.original)}
                                            style={{ marginRight: 5 }}
                                        />
                                        <Button
                                            size="lg"
                                            color="default"
                                            label={t("buttons.commonFiles") + this.state.countCommonFiles + ")"}
                                            onClick={() => this.onOpenCommonFilesModal(row.original)}
                                            style={{ marginRight: 5 }}
                                        />
                                    </div>
                                    <div className="col-lg-9">
                                        <Button
                                            size="lg"
                                            color="default"
                                            label={t("buttons.files") + this.state.countSolutionFiles + ")"}
                                            onClick={() => this.onOpenSolutionFilesModal(row.original)}
                                            style={{ marginRight: 5 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }}
                />
                {this.state.selectedTask && this.state.openProblemFiles ?
                    <FilesModal
                        open={this.state.openProblemFiles}
                        onClose={this.onCloseProblemFilesModal}
                        type={"TaskInstances"}
                        obj_id={this.state.selectedTask.id}
                        extra={{ key: 'isSolution', value: false }}
                        editable={false}
                    />
                    : null
                }
                {this.state.selectedTask && this.state.openCommonFiles ?
                    <FilesModal
                        open={this.state.openCommonFiles}
                        onClose={this.onCloseCommonFilesModal}
                        type={"TaskCatalogs"}
                        obj_id={this.state.selectedTask.taskCatalog.id}
                        extra={{ key: 'isSolution', value: false }}
                        editable={false}
                    />
                    : null
                }
                {this.state.selectedTask && this.state.openSolutionFiles ?
                    <FilesModal
                        open={this.state.openSolutionFiles}
                        obj_id={this.state.selectedTask.id}
                        onClose={this.onCloseSolutionFilesModal}
                        type={"TaskInstances"}
                        extra={{ key: 'isSolution', value: true }}
                        editable={false}
                    />
                    : null
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userProfile: state.profile.profile,
    tasksData: state.tasks.historyTasks,
    teamsData: state.teams.teams,
    severities: state.severities.severities
})
const mapDispatchToProps = dispatch => bindActionCreators({ getHistoryTasks, countFiles }, dispatch)

export default compose(translate('tasks'), connect(mapStateToProps, mapDispatchToProps))(HistoryTasks)
