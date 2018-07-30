import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faToggleOff } from '@fortawesome/fontawesome-free-solid'
import { faKeyboard, faCheckCircle } from '@fortawesome/fontawesome-free-regular'
import { Line } from 'rc-progress'
import Tooltip from 'react-tooltip'
import moment from 'moment'
import { translate } from 'react-i18next'
import Button from '../../common/buttons/button'
import { getChecklists, getActiveInstance, beginChecklist, pauseChecklist, abortChecklist, solveChecklist } from '../checklists/checklistActions'
import Event from './workOrderListFragments/eventFrag'
import ProgressModal from './progressModal'
import { getSeverities } from '../severities/severityActions'
import { getDataTypes } from '../dataTypes/dataTypeActions'
import io from '../../../utils/io'


class ChecklistList extends React.Component {

    constructor(props) {
        super(props)

        this.access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
        this.TIME_FORMAT = "YYYY-MM-DD kk:mm:ss"

        this.state = {

            filterFields: [],
            currentInstance: null,
            currentCatalog: null,
            currentCheckpoint: null,
            isMe: false,
            openProgressModal: false,

            expanded: {},
            currentData: [],
            loading: true,
            totalPages: null,

            tablestate: {
                page: 0,
                pageSize: 10,
                sorted: null,
                filtered: null
            }
        };

    }

    componentDidMount() {
        io.on("ChecklistCatalog", data => {
            if (data.method !== "CREATED") {
                this.fetchData()
                this.setState({
                    openProgressModal: false,
                    expanded: {}
                })
            } else {
                this.fetchData()
            }
        })
        io.on("ChecklistInstance", data => {
            if (this.state.isMe !== true) {
                this.getActiveInstance(this.state.currentCatalog)
            }
        })

        this.props.getSeverities()
        this.props.getDataTypes()
    }

    onSearchClick = async (filterFields) => {
        //this.fetchHistoryTasksData(filterFields)
        var row = []

        const resp = await this.props.getChecklists(filterFields)
        resp.rows.map(c => { if (c.instances.length !== 0) { for (var i = 0; i < c.instances.length; i++) { row.push(Object.assign({ instId: i }, c)) } } })
        this.setState({
            filterFields: filterFields,
            currentData: row,
        })
    }

    requestData = async () => {

        try {
            return await this.props.getChecklists(this.props.teams, this.state.filterFields)
        } catch (err) {
            console.log(err)
            return err
        }
    }
    fetchData = (state, instance) => {
        this.setState({
            loading: true
        }, () => {
            this.requestData()
                .then(resp => {

                    this.setState({
                        currentData: resp.rows,
                        //totalPages: resp.pages,
                        loading: false,
                        /*tablestate: {
                            pageSize: state.pageSize,
                            page: state.page,
                            sorted: state.sorted,
                            filtered: state.filtered
                        }*/
                    })
                })
        })
    }

    beginChecklist = (checklist) => {
        swal({
            title: this.props.t("swals.deleteTitle"),
            text: this.props.t("swals.beginChecklistText"),
            icon: "warning",
            buttons: true,
            dangerMode: false,
        }).then((update) => {
            if (update) {
                this.props.beginChecklist(checklist.id)
                    .then(resp => {
                        this.getActiveInstance(this.state.currentCatalog)
                        this.setState({
                            isMe: true,
                            openProgressModal: true
                        }, () => {
                            swal(this.props.t("swals.beginChecklistSuccess"), {
                                icon: "success"
                            })
                        })
                    }).catch(err => {
                        this.fetchData(this.state.tablestate, null)
                        if (err.header.statusCode === '400')
                            swal(this.props.t("swals.beginChecklistError"), {
                                icon: "success"
                            })
                        console.log(err.response.data)
                    })
            }
        })
    }


    onOpenProgressModal = () => {
        this.setState({
            isMe: true,
            openProgressModal: true
        })
    }
    onCloseProgressModal = () => {
        this.setState({
            openProgressModal: false,
            isMe: false,
        })
    }

    onAcceptChecklist = (checklist) => {
        this.props.solveChecklist(checklist.id).then(resp => {
            this.fetchData(this.state.tablestate)
        })

        this.setState({
            isMe: false,
            openProgressModal: false,
            expanded: {}
        }, () => {
            swal(this.props.t("swals.checklistFin"), {
                icon: "success"
            })
        })
        this.state.expanded = {}

    }

    onAbortChecklist = (checklist) => {
        this.props.abortChecklist(checklist.id)

        this.getActiveInstance(this.state.currentCatalog)

        this.setState({
            isMe: false,
            openProgressModal: false
        }, () => {
            swal(this.props.t("swals.checklistAbort"), {
                icon: "success"
            })
            this.forceUpdate()
        })
    }
    onPauseChecklist = (checklist, comment) => {
        this.props.pauseChecklist(checklist.id, comment)

        this.getActiveInstance(this.state.currentCatalog)

        this.setState({
            isMe: false,
            openProgressModal: false
        }, () => {
            swal(this.props.t("swals.checklistPause"), {
                icon: "success"
            })
        })
        this.fetchData(this.state.tablestate)
    }

    getActiveInstance = (catalog) => {

        this.props.getActiveInstance(this.props.userProfile.id, catalog.id)
            .then(resp => {
                this.setState({
                    currentInstance: resp,
                    currentCatalog: catalog,
                    refresh: false
                }, () => {
                    return true
                })
            })
    }

    render() {
        const { t } = this.props;
        const columns = [
            {
                Header: t("tables:headers.name"),
                accessor: 'catalog.name',
                maxWidth: 200,
                Cell: (row) => (
                    <div className="text-center">
                        <b>{row.original.name}</b>
                    </div>
                )
            }, {
                Header: t("tables:headers.description"),
                accessor: 'catalog.description',
                Cell: (row) => (
                    <div className="text-center">
                        {row.original.description}
                    </div>
                )
            }, {
                Header: t("tables:headers.area"),
                maxWidth: 200,
                Cell: (row) => (
                    <div className="text-center">
                        {row.original.area.name}
                    </div>
                )
            }, {
                Header: t("tables:headers.activeFrequency"),
                accessor: 'active',
                maxWidth: 120,
                Cell: (row) => (
                    <div className="text-center">
                        <FontAwesomeIcon icon={row.original.active ? faCheck : faTimes} style={{ color: row.original.active ? "#1ab394" : "#ed5565" }} />
                    </div>
                )
            }
        ]

        const { loading, currentData, expanded } = this.state

        const renderCheckpoints = (checkpoints) => {

            return checkpoints.sort((a, b) => a.order > b.order).map((cp, key) => (
                <div key={key} className="vertical-timeline-block">
                    <div
                        className="vertical-timeline-icon"
                        style={{ backgroundColor: cp.state === "pending" ? "white" : (cp.state === "notok" ? "#ed5565" : "#1ab394") }}
                        data-tip={cp.state}
                        data-type="light"
                        data-effect="float"
                    >
                        <FontAwesomeIcon
                            icon={cp.type === "oknok" ? faToggleOff : faKeyboard}
                            style={{ marginTop: 9 }}
                            color={cp.state === 'pending' ? 'grey' : 'white'}
                        />
                        <Tooltip />
                    </div>
                    <div className="vertical-timeline-content" style={{ marginBottom: 5 }}>
                        <div className="col-lg-11">
                            <span style={{ margin: 0, fontSize: 15 }}>
                                {cp.title}
                            </span>
                            {cp.state !== "pending" && cp.type === "input" ?
                                <small>
                                    <br />
                                    {t("labels.value")}<b>{cp._events[cp._events.length - 1].value + " " + this.props.dataTypes.filter(dt => dt.id === cp._dataType.id)[0].units}</b>
                                </small> : null
                            }
                        </div>
                    </div>
                </div>
            ))
        }

        const renderEvents = (instance) => {
            return instance._events.map((event, key) => (
                <Event key={key} event={event} instanceId={instance.id} context={"ChecklistsInstance"} />
            ))
        }

        const getProgressColor = (percentage) => {
            switch (true) {
                case (percentage < 25):
                    return '#d33115'
                case (percentage >= 25 && percentage < 50):
                    return '#fe9200'
                case (percentage >= 50 && percentage < 75):
                    return '#fcdc00'
                case (percentage >= 75):
                    return '#2abc25'
            }
        }

        const css = {
            divNoAnswer: {
                height: 500,
                position: 'relative'
            },
            divDefault: {
                height: 500
            },
            center: {
                width: 450,
                bottom: '50%',
                top: '30%',
                right: '50%',
                left: '30%',
                position: 'absolute',
                display: 'inline-block',
                align: 'center',
                WebkitTransform: "translate(0px,-50%)"
            }
        }
        //<SearchManager data={currentData} callback={this.onSearchClick} whatSearch={["description", "area.name", "assignedToType"]} />
        return (
            <div className="ibox float-e-margins" >


                <ReactTable
                    data={currentData}
                    columns={columns}
                    loading={loading}
                    expanded={expanded}
                    onFetchData={this.fetchData}
                    defaultSortDesc={true}
                    defaultPageSize={10}
                    className="-striped -highlight text-center "
                    freezeWhenExpanded={true}
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
                            expanded: {
                                [index]: this.state.expanded[index] ? false : true,
                            },
                            currentInstance: null,
                            currentCatalog: null
                        })
                    }}
                    SubComponent={row => {
                        if (!this.state.currentInstance && row.original.active)
                            this.getActiveInstance(row.original)

                        const instance = this.state.currentInstance
                        //console.log(instance)
                        if (!instance) {
                            return (
                                <div className="text-left ibox-content" style={css.divNoAnswer}>
                                    <div style={css.center}>
                                        <div style={{ textAlign: 'center', fontSize: '2em' }}>
                                            <FontAwesomeIcon icon={faCheckCircle} size="8x" style={{ color: 'rgba(0,0,0,0.2)' }} />
                                        </div>
                                        <p style={{ textAlign: 'center', fontSize: 25, color: 'rgba(0,0,0,0.4)' }}>{t("labels.checklistFulfill")}</p>

                                    </div>
                                </div>
                            )
                        }

                        /* State Logic */
                        let pbType = "progress-bar progress-bar-", divStyle = "progress "
                        switch (this.state.currentInstance.state) {
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
                                pbType += "danger"
                                break
                        }

                        /* Percentage logic */
                        const percentage = instance && instance._checkpoints && instance._checkpoints.length > 0 ?
                            Math.ceil((instance._checkpoints.filter(cp => cp.state !== 'pending').length / instance._checkpoints.length) * 100)
                            : 0
                        const color = getProgressColor(percentage)

                        //timeout vai ter de ser medido entre o tta da checklist e o tempo corrente

                        const diff = moment(instance.tta).local().diff(moment())
                        let canAbort = diff > 0
                        if (diff > 0)
                            //se o valor for negativo, tta já expirou
                            setTimeout(() => {
                                canAbort = false
                                this.forceUpdate()
                            }, diff)

                        return (
                            <div className="text-left ibox-content">
                                {!instance ?
                                    <h3>{t("labels.loading")}</h3>
                                    :
                                    instance._checkpoints && instance._checkpoints.length === 0 ?
                                        <h3>{t("labels.noCheckAssociated")}</h3>
                                        :
                                        <div>
                                            <div ref="problem" className="col-lg-3 row-lg-2 b-r" style={css.divDefault}>
                                                <div className="row-lg-1">
                                                    <h2>{t("labels.checklist")}</h2>
                                                </div>
                                                <div className="row-lg-1">
                                                    <h3>{t("labels.description")}</h3>
                                                </div>
                                                <div style={css.descBig}>
                                                    {row.original.description}
                                                </div>
                                                <div>
                                                    <div className="hr-line-dashed" />
                                                    <div className="row-lg-2">
                                                        <h4>{t("labels.area")}</h4>
                                                    </div>
                                                    <div style={css.extra}>
                                                        {row.original.area.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 row-lg-2 b-r " style={css.divDefault}>
                                                <div className="row-lg-2">
                                                    <h2>{t("labels.checkpoints")}</h2>
                                                    <div style={{ marginLeft: -10 }}>
                                                        <span className="col-lg-2">{t("labels.progress")}</span>
                                                        <div className="col-lg-6" style={{ marginLeft: -20 }}>
                                                            <Line
                                                                strokeWidth="2"
                                                                percent={percentage}
                                                                strokeColor={color}
                                                            />
                                                        </div>
                                                        <span className="col-lg-1" style={{ marginLeft: -20 }}>{percentage}%</span>
                                                        <div className="pull-right">
                                                            <span className="col-lg-2">{t("labels.state")}</span>
                                                            <div className="col-lg-9">
                                                                <div
                                                                    style={{ width: 40, margin: '0 auto' }}
                                                                    className={divStyle}>
                                                                    <div
                                                                        style={{ width: 40 }}
                                                                        aria-valuemax="100"
                                                                        aria-valuenow="100"
                                                                        role="progressbar"
                                                                        className={pbType}
                                                                        data-tip={instance.state}
                                                                        data-type="light"
                                                                        data-effect="float"
                                                                    >
                                                                        <Tooltip />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br />
                                                <br />
                                                <div style={{ height: instance.state === "pending" || instance.state === "paused" ? 275 : 425, overflow: 'auto' }}>
                                                    <div id="vertical-timeline" className="vertical-container dark-timeline no-margins">
                                                        {renderCheckpoints(instance._checkpoints)}
                                                    </div>
                                                </div>
                                                <br />
                                                {instance.state === "pending" || instance.state === "paused" ?
                                                    <Button
                                                        size="lg"
                                                        color="success"
                                                        label={t("buttons.beginChecklist")}
                                                        style={{ fontSize: 25, marginRight: 5, margin: 'auto', display: 'block' }}
                                                        onClick={() => this.beginChecklist(instance)}
                                                    /> : null
                                                }
                                            </div>
                                            <div className={"col-lg-3 row-lg-2 m-b-lg"} style={{ height: 500, width: '100% + 10px', overflow: 'auto' }}>
                                                <div id="vertical-timeline" className="vertical-container dark-timeline no-margins">
                                                    {renderEvents(instance)}
                                                </div>
                                            </div>

                                            <div className="col-lg-9">
                                                {this.state.currentInstance.state === "done" ?
                                                    <Button
                                                        size="lg"
                                                        color="default"
                                                        label={t("buttons.files")}
                                                        style={{ marginRight: 5 }}
                                                    /> : null
                                                }
                                                {this.state.currentInstance.state === "wip" ? //paused
                                                    <Button
                                                        size="lg"
                                                        color="success"
                                                        label={t("buttons.continueChecklist")}
                                                        onClick={() => this.onOpenProgressModal()}
                                                    /> : null
                                                }
                                                {this.state.currentInstance.state === "wip" && canAbort ?
                                                    <Button
                                                        size="lg"
                                                        color="danger"
                                                        label={t("buttons.abort")}
                                                        extra={'pull-right'}
                                                        style={{ marginRight: 5 }}
                                                        onClick={() => this.onAbortChecklist(this.state.currentInstance)}
                                                    /> : null
                                                }
                                            </div>
                                        </div>

                                }
                            </div>
                        )
                    }}
                />
                {this.state.currentInstance ?
                    <ProgressModal
                        open={this.state.openProgressModal}
                        checklist={this.state.currentInstance}
                        onClose={this.onCloseProgressModal}
                        onAbort={this.onAbortChecklist}
                        onPause={this.onPauseChecklist}
                        callback={this.onAcceptChecklist}
                    /> : null
                }
            </div >
        )
    }
}

const mapStateToProps = state => ({
    userProfile: state.profile.profile,
    severities: state.severities.severities,
    dataTypes: state.dataTypes.dataTypes
})
const mapDispatchToProps = dispatch => bindActionCreators({
    getSeverities, getChecklists, getActiveInstance, beginChecklist,
    pauseChecklist, abortChecklist, solveChecklist, getDataTypes
}, dispatch)
export default compose(translate('checklists'), connect(mapStateToProps, mapDispatchToProps))(ChecklistList)
