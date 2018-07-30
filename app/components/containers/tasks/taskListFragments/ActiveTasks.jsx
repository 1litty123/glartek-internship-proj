import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import Tooltip from 'react-tooltip'
import { bindActionCreators, compose } from 'redux'
import axios from 'axios'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faUser, faUsers } from '@fortawesome/fontawesome-free-solid'
import { faFrown } from '@fortawesome/fontawesome-free-regular'
import moment from 'moment'
import { translate } from 'react-i18next'
import Button from '../../../common/buttons/button'
import Span from '../../../common/icons/span'
import Consts from '../../../../utils/consts'
import EndModal from './../endModal'
import Event from './../workOrderListFragments/eventFrag'
import FilesModal from '../../files/filesModal'
import SearchManager from '../../search/searchManager'
import { getActiveTasks, updateTask, endTask, getTask, getEventProfile } from '../taskActions'
import { endAlarm } from '../../alarms/alarmActions'
import { countFiles } from '../../files/fileActions'
import io from '../../../../utils/io'

class ActiveTasks extends React.Component {

    constructor(props) {
        super(props)

        this.access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
        this.TIME_FORMAT = "YYYY-MM-DD kk:mm:ss"

        this.state = {
            dataWithElementName: [],
            filterFields: [],
            openEnd: false,
            openEdit: false,
            selectedTask: null,
            abortPossible: false,
            isMe: false,
            openFiles: false,
            countFiles: -1,
            openCommonFiles: false,
            countCommonFiles: -1,

            active: {
                currentData: [],
                loading: true,
                totalPages: null,
                expanded: {},
                currentAlarm: this.props.t("labels.undefined"),
                currentElem: this.props.t("labels.undefined"),
                currentFiles: []
            },

            tablestate: {
                page: 0,
                pageSize: 10,
                sorted: null,
                filtered: null
            }
        }
    }

    componentDidMount() {
        io.on("TaskCatalog", data => { if (!this.state.isMe) { this.fetchActiveTasksData() } })
        io.on("TaskInstance", data => { if (!this.state.isMe) { this.fetchActiveTasksData() } })
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
    onSearchClick = async (filterFields) => {
        //this.fetchHistoryTasksData(filterFields)
        var row = []
        var count = 0
        const resp = await this.props.getActiveTasks(filterFields)
        resp.rows.map(r => {
            if (r.taskCatalog.type === "evolutionary") {
                row.push(r)
                count++
            }
        })

        this.setState({
            filterFields: filterFields,
            countPeriodic: count,
            active: {
                ...this.state.active,
                currentData: row,
                totalPages: resp.pages,
                loading: false
            }
        })
    }

    onOpenEndModal = (task) => {
        this.setState({
            openEnd: true,
            selectedTask: task
        })
    }
    onCloseEndModal = () => {
        this.setState({
            openEnd: false,
            selectedTask: null
        })
    }
    onAcceptEndModal = async (modalData) => {
        const taskData = {
            reason: modalData.reason,
            description: modalData.description
        }

        try {
            await this.props.endTask(taskData, this.state.selectedTask.id, modalData.solved ? "solve" : "defer")
            this.props.getTask(this.state.selectedTask.id)
                .then(resp => {
                    let _currentData = this.state.active.currentData
                    const index = _currentData.indexOf(_currentData.filter(t => t.id === this.state.selectedTask.id)[0])
                    _currentData.splice(index, 1)
                    this.fetchActiveTasksData()
                    this.setState({
                        active: {
                            ...this.state.active,
                            currentData: _currentData
                        }
                    }, () => {
                        swal(this.props.t("swals.endTask"), {
                            icon: "success"
                        })
                        this.onCloseEndModal()
                    })
                })

            if (this.state.selectedTask.alarmCatalogId)
                this.props.endAlarm(this.state.selectedTask.alarmCatalogId)
        } catch (err) {
            console.log(err)
        }
    }

    onOpenFilesModal = (task) => {
        this.setState({
            openFiles: true,
            selectedTask: task
        })
    }
    onCloseFilesModal = () => {
        this.props.countFiles("TaskInstances", null, this.state.selectedTask.id, null, { key: 'isSolution', value: false })
            .then(resp => {
                this.setState({
                    countFiles: resp.data.count,
                    openFiles: false,
                    selectedTask: null
                })
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


    requestActiveTasksData = async () => {
        try {
            return await this.props.getActiveTasks(this.state.filterFields)
        } catch (err) {
            return err
        }
    }
    fetchActiveTasksData = (state, instance) => {
        this.setState({
            active: {
                ...this.state.active,
                loading: true
            }
        }, () => {
            this.requestActiveTasksData()
                .then(resp => {

                    var row = []
                    resp.rows.map(r => { if (r.taskCatalog.type === "evolutionary") { row.push(r) } })
                    row.map(d => {
                        return axios.get(Consts.API_URL + "/" + d.taskCatalog.elementType + "s/" + d.taskCatalog.elementId + "?" + this.access_token)
                            .then(elementData => {
                                axios.get(Consts.API_URL + "/TaskInstances/" + d.id + "/events/"
                                    + d._events[0].id + "/by?" + "access_token=" + JSON.parse(localStorage.getItem('_user')).id).then(prof => {


                                        let merged = this.state.dataWithElementName
                                        merged.push(Object.assign({ elementName: elementData.data.name, user: prof.data }, d))
                                        this.setState({
                                            dataWithElementName: merged
                                        })
                                    })
                            })
                    })
                    this.setState({
                        active: {
                            ...this.state.active,
                            currentData: row,
                            totalPages: resp.pages,
                            loading: false
                        },
                        /* tablestate: {
                             pageSize: state.pageSize,
                             page: state.page,
                             sorted: state.sorted,
                             filtered: state.filtered
                         }*/
                    })
                })
        })
    }


    beginTask = (task) => {
        this.setState({
            isMe: true,
        })
        swal({
            title: this.props.t("swals.beginTaskTitle"),
            text: this.props.t("swals.beginTaskText"),
            icon: "warning",
            buttons: true,
            dangerMode: false,
        }).then((update) => {
            if (update) {
                axios.post(Consts.API_URL + "/TaskInstances/" + task.id + "/begin?" + this.access_token)
                    .then(event => {
                        this.props.getTask(task.id)
                            .then(resp => {
                                let _currentData = this.state.active.currentData
                                const index = _currentData.indexOf(_currentData.filter(t => t.id === task.id)[0])
                                _currentData[index] = resp.data[0]
                                this.setState({
                                    isMe: false,
                                    active: {
                                        ...this.state.active,
                                        currentData: _currentData
                                    }
                                }, () => {
                                    swal(this.props.t("swals.beginTaskSuccess"), {
                                        icon: "success"
                                    })
                                })
                            })
                    }).catch(err => {
                        if (err.header && err.header.statusCode === '400')
                            swal(this.props.t("swals.beginTaskError"), {
                                icon: "success"
                            })
                        else
                            swal(this.props.t("swals.beginTaskErrorError"), {
                                icon: "warning"
                            })
                        console.log(err.response.data)
                    })
            }
        })
    }
    abortTask = (task) => {
        this.setState({
            isMe: true,
        })
        axios.post(Consts.API_URL + "/TaskInstances/" + task.id + "/abort?" + this.access_token)
            .then(event => {
                this.props.getTask(task.id)
                    .then(resp => {
                        let _currentData = this.state.active.currentData
                        const index = _currentData.indexOf(_currentData.filter(t => t.id === task.id)[0])
                        _currentData[index] = resp.data[0]
                        this.setState({
                            isMe: false,
                            active: {
                                ...this.state.active,
                                currentData: _currentData
                            }
                        }, () => {
                            swal(this.props.t("swals.abortTask"), {
                                icon: "success"
                            })
                        })
                    })
            }).catch(err => {
                this.fetchActiveTasksData(this.state.tablestate.active, null)
                console.log(err.response.data)
            })
    }

    render() {
        const { t } = this.props;
        const { active } = this.state

        const getAlarm = (id) => {
            axios.get(Consts.API_URL + "/AlarmsCatalog/" + id + "?" + this.access_token)
                .then(alarmData => {
                    this.setState({
                        active: {
                            ...this.state.active,
                            currentAlarm: alarmData ? alarmData.data.name : t("labels.noAlarmFound")
                        }
                    }, () => {
                        return
                    })
                }).catch(err => {
                    console.log(err)
                })
        }

        const getElement = (id, type) => {
            axios.get(Consts.API_URL + "/" + type + "s/" + id + "?" + this.access_token)
                .then(elementData => {
                    if (elementData.data) {
                        this.setState({
                            active: {
                                ...this.state.active,
                                currentElem: elementData.data.name
                            }
                        })
                    }
                })
        }

        const renderEvents = (instance) => {
            return instance._events.map((event, key) => (
                <Event key={key} event={event} instanceId={instance.id} context={"TaskInstances"} />
            ))
        }

        const countFiles = (obj) => {
            this.props.countFiles("TaskInstances", null, obj.id, null, { key: 'isSolution', value: false })
                .then(resp => {
                    this.setState({
                        countFiles: resp.data.count
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

        const activeColumns = [

            {
                Header: t("tables:headers.alarm"),
                accessor: 'taskCatalog.alarmCatalogId',
                maxWidth: 50,
                sortable: false,
                /* filterable: true, */
                filterMethod: (filter, row) => {
                    switch (filter.value) {
                        case 'with':
                            return row.taskCatalog.alarmCatalogId
                        case 'without':
                            return !row.taskCatalog.alarmCatalogId
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
            }, {
                Header: t("tables:headers.startAt"),
                accessor: 'instances.createdAt',
                maxWidth: 120,
                Cell: (row) => (
                    <div className="text-center">
                        {moment(row.original._events[0].timestamp).local().format(this.TIME_FORMAT)}
                    </div>
                )
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
                Header: t("tables:headers.elementName"),
                accessor: 'instances.createdAt',
                maxWidth: 120,
                Cell: (row) => (
                    <div className="text-center">

                        {this.state.dataWithElementName[row.index] ? this.state.dataWithElementName[row.index].elementName : ""}
                    </div>
                )
            },
            {
                Header: t("tables:headers.createdBy"),
                accessor: 'instances.createdBy',
                maxWidth: 120,
                Cell: (row) => (
                    <div className="text-center">
                        {this.state.dataWithElementName[row.index] ? this.state.dataWithElementName[row.index].user.name : ""}
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
                        case 'pending':
                            return row.state === "pending"
                        case 'wip':
                            return row.state === "wip"
                        case 'paused':
                            return row.state === "paused"
                        case 'done':
                            return row.state === "done"
                        case 'not done':
                            return row.state === "not done"
                        case 'overdue':
                            return row.state === "overdue"
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
                        <option value='overdue'>Overdue</option>
                    </select>
                ),
                Cell: row => {
                    let pbType = "progress-bar progress-bar-", divStyle = "progress "
                    switch (row.original.state) {
                        case "pending":
                            pbType += "warning"
                            divStyle += "progress-striped"
                            break
                        case "wip":
                            pbType += "success"
                            divStyle += "progress-striped active"
                            break
                        case "paused":
                            pbType += "success"
                            divStyle += "progress-striped"
                            break
                        case "done":
                            pbType += ""
                            break
                        case "not done":
                        case "overdue":
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

        return (
            <div className="wrapper wrapper-content animated">
                <SearchManager data={active.currentData} callback={this.onSearchClick} whatSearch={["assignedToType", "state", "createdAt"]} />

                <ReactTable
                    data={active.currentData}
                    columns={activeColumns}
                    loading={active.loading}
                    expanded={active.expanded}
                    onFetchData={this.fetchActiveTasksData}
                    previousText={t("tables:buttons.previous")}
                    nextText={t("tables:buttons.next")}
                    pageText={t("tables:texts.page")}
                    ofText={t("tables:texts.of")}
                    noDataText={t("tables:texts.noData")}
                    rowsText={t("tables:texts.rows")}
                    defaultPageSize={10}
                    className="-striped -highlight text-center "
                    freezeWhenExpanded={this.state.openSolution || this.state.openEdit}
                    collapseOnDataChange={false}
                    collapseOnPageChange={true}
                    collapseOnSortingChange={true}
                    defaultSortDesc={true}
                    onExpandedChange={(newExpanded, index, event) => {
                        this.setState({
                            active: {
                                ...this.state.active,
                                expanded: { [index]: this.state.active.expanded[index] ? false : true },
                                currentElem: t("labels.undefined"),
                                currentAlarm: t("labels.undefined")
                            }
                        })
                    }}
                    SubComponent={row => {
                        if (row.original.taskCatalog.alarmCatalogId && this.state.active.currentAlarm === t("labels.undefined"))
                            getAlarm(row.original.taskCatalog.alarmCatalogId)
                        if (this.state.active.currentElem === t("labels.undefined"))
                            getElement(row.original.taskCatalog.elementId, row.original.taskCatalog.elementType)
                        if (this.state.countFiles === -1 || this.state.countCommonFiles === -1) {
                            countFiles(row.original)
                            countCommonFiles(row.original.taskCatalog)
                        }
                        //timeout vai ter de ser medido entre o tta da tarefa e o tempo corrente
                        //const diff = moment.duration(moment(row.original.tta).diff(moment())).asSeconds()
                        const diff = moment(row.original.tta).local().diff(moment())
                        let canAbort = diff > 0
                        if (diff > 0)
                            //se o valor for negativo, tta já expirou
                            setTimeout(() => {
                                canAbort = false
                                this.forceUpdate()
                            }, diff)

                        return (
                            <div className="text-left ibox-content">
                                <div ref="problem" className="col-lg-3 row-lg-2 b-r" style={css.divDefault}>
                                    <div className="row-lg-1">
                                        <h2>{t("labels.problem")}</h2>
                                    </div>
                                    <div className="row-lg-1">
                                        <h3>{t("labels.description")}</h3>
                                    </div>
                                    <div style={!row.original.taskCatalog.alarmCatalogId ? css.descBig : css.descDefault}>
                                        {row.original.taskCatalog.problem}
                                    </div>
                                    <div>
                                        <div className="hr-line-dashed" />
                                        <div className="row-lg-2">
                                            <h4>{row.original.taskCatalog.elementType || "Type"}</h4>
                                        </div>
                                        <div style={css.extra}>
                                            {this.state.active.currentElem}
                                        </div>
                                        {
                                            !row.original.taskCatalog.alarmCatalogId ? null :
                                                <div>
                                                    <div className="row-lg-2">
                                                        <h4>{t("labels.alarm")}</h4>
                                                    </div>
                                                    <div style={css.extra}>
                                                        {this.state.active.currentAlarm}
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className="col-lg-6 row-lg-2 b-r" style={css.divDefault}>
                                        <div className="row-lg-2">
                                            <h2>{t("labels.outcome")}</h2>
                                        </div>
                                        <div style={css.center}>
                                            <div style={{ textAlign: 'center', fontSize: '2em' }}>
                                                <FontAwesomeIcon icon={faFrown} size="8x" style={{ color: 'rgba(0,0,0,0.2)' }} />
                                            </div>
                                            <p style={{ textAlign: 'center', fontSize: 25, color: 'rgba(0,0,0,0.4)' }}>{t("labels.outcomeMsg")}</p>
                                            <br />
                                            <br />
                                            {row.original.state === "pending" || row.original.state === "paused" || row.original.state === "overdue" ?
                                                <Button
                                                    size="lg"
                                                    color="success"
                                                    label={t("buttons.beginTask")}
                                                    style={{ fontSize: 25, marginRight: 5, margin: 'auto', display: 'block' }}
                                                    onClick={() => this.beginTask(row.original)}
                                                /> : null
                                            }
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
                                            label={t("buttons.files") + this.state.countFiles + ")"}
                                            onClick={() => this.onOpenFilesModal(row.original)}
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
                                        {/* row.original.state == "done" || row.original.state == "not done" ?
                                            <Button
                                                size="lg"
                                                color="default"
                                                label="Files"
                                                style={{ marginRight: 5 }}
                                            /> : null */
                                        }
                                        {row.original.state === "wip" ?
                                            <Button
                                                size="lg"
                                                color="success"
                                                label={t("buttons.end")}
                                                style={{ marginRight: 5 }}
                                                onClick={() => this.onOpenEndModal(row.original)}
                                            /> : null
                                        }
                                        {/* row.original.state != "pending" && row.original.state != "done" && this.props.userRole != 'operator' ?
                                            <Button
                                                size="lg"
                                                color="info"
                                                label="Edit"
                                                onClick={() => this.onOpenEditModal(row.original)}
                                            /> : null
                                         */}
                                        {row.original.state === "wip" && canAbort ?
                                            <Button
                                                size="lg"
                                                color="danger"
                                                label={t("buttons.abort")}
                                                extra={'pull-right'}
                                                style={{ marginRight: 5 }}
                                                onClick={() => this.abortTask(row.original)}
                                            /> : null
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }}
                />
                {this.state.selectedTask ?
                    <EndModal
                        open={this.state.openEnd}
                        task={this.state.selectedTask}
                        onClose={this.onCloseEndModal}
                        callback={this.onAcceptEndModal}
                    />
                    : null
                }
                {this.state.selectedTask && this.state.openFiles ?
                    <FilesModal
                        open={this.state.openFiles}
                        obj_id={this.state.selectedTask.id}
                        onClose={this.onCloseFilesModal}
                        type={"TaskInstances"}
                        extra={{ key: 'isSolution', value: false }}
                        editable={true}
                    />
                    : null
                }
                {this.state.selectedTask && this.state.openCommonFiles ?
                    <FilesModal
                        open={this.state.openCommonFiles}
                        obj_id={this.state.selectedTask.taskCatalog.id}
                        onClose={this.onCloseCommonFilesModal}
                        type={"TaskCatalogs"}
                        extra={{ key: 'isSolution', value: false }}
                        editable={false}
                    />
                    : null
                }
                {/* this.state.selectedTask && this.props.userRole != 'operator' ?
                    <EditModal
                        open={this.state.openEdit}
                        onClose={this.onCloseEditModal}
                        callback={this.onAcceptEditModal}
                        task={this.state.selectedTask.taskCatalog}
                        severities={this.props.severities}
                    />
                    : null
                 */}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userProfile: state.profile.profile,
    userRole: state.profile.role,
    tasksData: state.tasks.activeTasks,
    teamsData: state.teams.teams,
    severities: state.severities.severities
})
const mapDispatchToProps = dispatch => bindActionCreators({ getTask, getActiveTasks, updateTask, endTask, endAlarm, getEventProfile, countFiles }, dispatch)

export default compose(translate("tasks"), connect(mapStateToProps, mapDispatchToProps))(ActiveTasks)
