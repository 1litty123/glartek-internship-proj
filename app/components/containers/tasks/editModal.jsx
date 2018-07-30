import React from 'react';
import Modal from 'react-responsive-modal'
import Button from '../../common/buttons/button'
import { translate } from 'react-i18next'

const INITIAL_STATE = {
    severityId: "",
    title: "",
    problem: ""
}

class EditModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE
    }

    componentDidMount() {
        this.setState({
            severityId: this.props.task.severityId,
            title: this.props.task.title,
            problem: this.props.task.problem
        })
    }


    sendData = () => {
        const modalData = {
            id: this.props.task.id,
            severityId: this.refs.severityId.value,
            title: this.refs.title.value ? this.refs.title.value : this.props.task.title,
            problem: this.refs.problem.value ? this.refs.problem.value : this.props.task.problem
        }
        this.props.callback(modalData)
    }

    render() {
        const { t } = this.props;
        const renderSeverityOptions = () => {
            const data = this.props.severities.sort((a, b) => a.value < b.value) || []
            if (data !== []) {
                return data.map(reg => (
                    <option key={reg.id} value={reg.id} select={reg.id === this.props.severityId ? "selected" : ""}>
                        {reg.type}
                    </option>
                )
                )
            } else {
                return []
            }
        }

        return (
            <Modal open={this.props.open} onClose={this.props.onClose} showCloseIcon={false} little>
                <div className="modal-form">
                    <div className="modal-dialog" style={{ margin: 'auto' }}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="row-sm-3">
                                    <h3 className="m-t-none m-b">{t("labels.editTask")}</h3>
                                    <p>{t("labels.editTaskSub") + this.props.task.title + "'"}</p>
                                </div>
                                <hr />
                                <div className="row-sm-9">
                                    <form role="form" style={{ overflow: 'auto' }} onChange={this.checkError}>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">
                                                {t("labels.severity")}
                                            </label>
                                            <select
                                                ref="severityId"
                                                className="form-control m-b"
                                                value={this.state.severityId}
                                                onChange={(e) => this.setState({ severityId: e.target.value })}
                                            >
                                                {renderSeverityOptions()}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">
                                                {t("labels.taskTitle")}
                                            </label>
                                            <textarea
                                                ref="title"
                                                className="form-control"
                                                style={{ resize: 'vertical' }}
                                                value={this.state.title}
                                                onChange={(e) => this.setState({ title: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">
                                                {t("labels.problem")}
                                            </label>
                                            <textarea
                                                ref="problem"
                                                className="form-control"
                                                style={{ resize: 'vertical' }}
                                                value={this.state.problem}
                                                onChange={(e) => this.setState({ problem: e.target.value })}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ float: 'right' }}>
                        <Button onClick={() => this.props.onClose()} color="default" label={t("buttons.cancel")} />
                        &nbsp;
                        <Button onClick={() => this.sendData()} color="primary" label={t("buttons.confirm")} />
                    </div>
                </div>
            </Modal>
        )
    }
}

export default translate('tasks')(EditModal)
