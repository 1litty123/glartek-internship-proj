import React from 'react';
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import axios from 'axios'
import Consts from '../../../../utils/consts'
import { translate } from 'react-i18next'
import Button from '../../../common/buttons/button'
import { deleteCron } from '../cronActions'

const INITIAL_STATE = {
    name: {
        label: 'name',
        value: null
    },
    description: {
        label: 'description',
        value: null
    },
    data: []
}

class LoadCron extends React.Component {

    constructor(props) {
        super(props)
        this.selectedCron = null
        this.state = INITIAL_STATE
        this.data = []
    }


    search = () => {
        let params = "?access_token=" + JSON.parse(localStorage.getItem('_user')).id

        axios.get(Consts.API_URL + "/PredefinedTimes" + params)
            .then(resp => {
                this.setState({
                    data: resp.data
                })
            }).catch(err => {
                console.log(err.response.data)
            })

    }

    onDeleteCron = () => {
        swal({
            title: this.props.t("swals.deleteCronsTitle"),
            text: this.props.t("swals.deleteCronsText"),
            icon: "warning",
            buttons: true,
            dangerMode: false,
        }).then(async (ans) => {
            if (ans) {
                const resp = await this.props.deleteCron(this.selectedCron.id)
                if (resp && resp.data.error && resp.data.error.statusCode === 400) {
                    swal({
                        title: this.props.t("swals.deleteCronsTitle"),
                        text: this.props.t("swals.deleteCronsDeactivateJobs"),
                        icon: "warning"
                    }).then(async (del) => {
                        if (del) {
                            await this.props.deleteCron(this.selectedCron.id, "deactivate=true")
                            const data = this.state.data.filter(c => c.id !== this.selectedCron.id)
                            this.setState({
                                selectedCron: null,
                                data: data
                            }, () => {
                                swal(this.props.t("swals.deleteCronsSuccess"), {
                                    icon: "success"
                                })
                            })
                        }
                    })
                }
                else {
                    if (resp && resp.data.error && resp.data.error.statusCode !== 500) {
                        const data = this.state.data.filter(c => c.id !== this.selectedCron.id)
                        this.setState({
                            selectedCron: null,
                            data: data
                        }, () => {
                            swal(this.props.t("swals.deleteCronsSuccess"), {
                                icon: "success"
                            })
                        })
                    }
                }
            }
        })
    }

    render() {
        const { t } = this.props
        if (this.state.data.length === 0) {
            this.search()
        }

        const columns = [
            {
                Header: t("tables:headers.name"),
                accessor: 'name',
                width: 350,
                filterable: false,
                filterMethod: (filter, row) => row.name.indexOf(filter.value) !== -1,
                Cell: row => (
                    <div>
                        <label>{row.original.name}</label>
                    </div>
                )
            }, {
                Header: t("tables:headers.description"),
                accessor: 'description'
            }
        ]

        return (
            <div>
                <div className="row-lg-3">
                    <div className="row">
                        <div className="pull-right" style={{ marginBottom: 10, marginRight: 10 }}>
                            <Button
                                size="lg"
                                color="danger"
                                label={t("buttons.delete")}
                                extra={"pull-right " + (this.selectedCron ? "" : "disabled")}
                                style={{ marginRight: 5 }}
                                onClick={this.onDeleteCron}
                            />
                        </div>
                    </div>
                </div>
                <ReactTable
                    data={this.state.data}
                    columns={columns}
                    defaultPageSize={10}
                    loading={false}
                    className="-striped -highlight text-center "
                    showPageSizeOptions={false}
                    previousText={t("tables:buttons.previous")}
                    nextText={t("tables:buttons.next")}
                    pageText={t("tables:texts.page")}
                    ofText={t("tables:texts.of")}
                    noDataText={t("tables:texts.noData")}
                    rowsText={t("tables:texts.rows")}
                    getTrProps={(state, rowInfo, column) => {

                        if (!rowInfo)
                            return {}
                        //https://tinyurl.com/yc3bqhku
                        //https://stackoverflow.com/questions/42025991/how-to-rerender-entire-single-row-in-react-table
                        return {
                            onClick: (e) => {
                                this.selectedCron = rowInfo.original
                                this.forceUpdate()
                                this.props.callback(this.selectedCron)
                            },
                            style: {
                                background: this.selectedCron && rowInfo.original.id === this.selectedCron.id ? '#177D5A' : '',
                                color: this.selectedCron && rowInfo.original.id === this.selectedCron.id ? 'white' : ''
                            }
                        }
                    }}
                />
            </div>
        )
    }

}


const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => bindActionCreators({ deleteCron }, dispatch)

export default compose(translate('cronManager'), connect(mapStateToProps, mapDispatchToProps))(LoadCron)
