import React from 'react';
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import moment from 'moment'
import { translate } from 'react-i18next'

class TaskManager extends React.Component {

    constructor(props) {
        super(props)

        this.access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
        this.TIME_FORMAT = "YYYY-MM-DD kk:mm:ss"

        this.state = {
        }
    }

    render() {
        return (
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="text-center m-t-lg">
                            <h1>
                                {"Work in Progress"}
                            </h1>
                            <small>
                                {"Page used for catalog edition, creation and deletion, similar to the checklist management page"}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
})
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default compose(translate('tasks'), connect(mapStateToProps, mapDispatchToProps))(TaskManager)
