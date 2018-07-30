import React from 'react';
import Modal from 'react-responsive-modal'
import Button from '../../common/buttons/button'
import { translate } from 'react-i18next'

const INITIAL_STATE = {
    error: true
}

class CreateTaskModal extends React.Component {

    constructor(props) {
        super(props)

        this.state = INITIAL_STATE
    }

    checkError = () => {
        this.setState({
            error: !this.refs.team.value || !this.refs.severity.value
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

    sendData = () => {
        const taskData = {
            title: this.refs.name.value ? this.refs.name.value : this.props.checkpoint.title,
            description: this.refs.description.value ? this.refs.description.value : this.props.checkpoint.description,
            assignedToId: this.refs.team.value,
            severityId: this.refs.severity.value,
            checkpointId: this.props.checkpoint.id
        }
        this.props.callback(taskData)
    }

    render() {
        const { t } = this.props;
        return (
            <Modal open={this.props.open} onClose={this.props.onClose} showCloseIcon={false} little closeOnEsc={false} closeOnOverlayClick={false}><div className="modal-form">
                <div className="modal-dialog" style={{ margin: 'auto' }}>
                    <div className="modal-body">
                        <div className="row">
                            <div className="row-sm-2">
                                {!this.props.checkpoint.title
                                    ? <div />
                                    : <h3 className="m-t-none m-b">{t("labels.createTask")}</h3>
                                }
                                <p>{t("labels.createTaskFor")}+{this.props.checkpoint.title}'</p>
                            </div>
                            <hr />
                            <div className="row-sm-5">
                                <form role="form" style={{ overflow: 'auto' }} /* onChange={this.checkError} */>
                                    <div className="form-group">
                                        <label>{t("labels.elementType")}</label>
                                        <br />
                                        <span>
                                            {this.props.checkpoint.elementType}
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <label>{t("labels.element")}</label>
                                        <br />
                                        <span>
                                            {this.props.checkpoint.elementId}
                                        </span>
                                    </div>
                                </form>
                            </div>
                            <hr />
                            <div className="row-sm-5">
                                <form role="form" style={{ overflow: 'auto' }} onChange={this.checkError}>
                                    <div className="form-group">
                                        <label>{t("labels.taskName")}</label>
                                        <input ref="name" placeholder={this.props.checkpoint.title} className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <label>{t("labels.problemDescription")}</label>
                                        <textarea ref="description" placeholder={this.props.checkpoint.description} className="form-control" style={{ resize: 'vertical' }} />
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-4" style={{ padding: 0 }}>
                                            <label>{t("labels.team")}</label>
                                            <select ref="team" className="form-control m-b">
                                                <option disabled selected value={null} />
                                                {this.renderTeamOptions()}
                                            </select>
                                        </div>
                                        <div className="col-sm-4" style={{ paddingRight: 0 }}>
                                            <label>{t("labels.severity")}</label>
                                            <select ref="severity" className="form-control m-b">
                                                {this.renderSeverityOptions()}
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ float: 'right' }}>
                    <Button onClick={() => this.props.onClose()} color="default" label={t("buttons.cancel")} />
                    &nbsp;
                <Button onClick={() => this.state.error ? null : this.sendData()} color="primary" label={t("buttons.create")} extra={this.state.error ? "disabled" : ""} />
                </div>
            </div>
            </Modal>
        )
    }
}

export default translate('tasks')(CreateTaskModal)
