import React from 'react';
import Modal from 'react-responsive-modal'
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import { translate } from 'react-i18next'
import Button from '../../common/buttons/button'
import FilesModal from '../files/filesModal'

const INITIAL_STATE = {
    //error starts as 'true' because all fields start empty, which disables task creation
    error: true,
    reason: null,
    description: null,
    solved: true,

    openFiles: false
}

class EndModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE
    }

    handleToggle = () => {
        this.setState({
            solved: !this.state.solved
        })
    }

    checkError = () => {
        this.setState({
            error: !this.state.reason.value
        })
    }

    sendData = () => {
        swal({
            title: this.props.t("swals.beginTaskTitle"),
            text: `${this.state.solved ? this.props.t("swals.endTaskSuccess") : this.props.t("swals.endTaskUnsuccess")}`,
            icon: "warning",
            buttons: true,
            dangerMode: false,
        }).then((resp) => {
            if (resp) {
                const modalData = {
                    solved: this.state.solved,
                    reason: this.state.reason.value,
                    description: this.state.description.value
                }
                this.props.callback(modalData)
                this.setState(INITIAL_STATE)
                swal(this.props.t("swals.endTask"), {
                    icon: "success"
                })
            }
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

    handleClose = () => {
        this.setState(INITIAL_STATE)
        this.props.onClose()
    }

    render() {
        const { t } = this.props;
        return (
            <Modal open={this.props.open} onClose={this.props.onClose} showCloseIcon={false} little>
                <div className="modal-form">
                    <div className="modal-dialog" style={{ margin: 'auto' }}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="row-sm-3">
                                    {!this.props.title
                                        ? <div />
                                        : <h3 className="m-t-none m-b">{t("labels.endTask")}</h3>
                                    }
                                    <p>{t("labels.endTaskSub") + this.props.task.taskCatalog.title + "'"}</p>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <label className="control-label" style={{ display: 'block' }}>
                                    {t("labels.wasSolved")}
                                </label>
                                <Toggle
                                    defaultChecked={this.state.solved}
                                    onChange={this.handleToggle}
                                />
                            </div>
                            <hr />
                            {this.state.solved ?
                                <div className="row-sm-9">
                                    <form role="form" style={{ overflow: 'auto' }} onChange={this.checkError}>
                                        <div className="form-group">
                                            <label>{t("labels.solution")}</label>
                                            <textarea
                                                ref={(textarea) => { this.state.reason = textarea }}
                                                placeholder={t("labels.solution")}
                                                className="form-control"
                                                style={{ resize: 'vertical' }}
                                                required
                                            />
                                            <span className="help-block m-b-none">
                                                {t("labels.solutionFound")}
                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <label>{t("labels.instructions")}</label>
                                            <textarea
                                                ref={(textarea) => { this.state.description = textarea }}
                                                placeholder={t("labels.instructions")}
                                                className="form-control"
                                                style={{ resize: 'vertical' }}
                                            />
                                            <span className="help-block m-b-none">
                                                {t("labels.specialInstruction")}
                                            </span>
                                        </div>
                                    </form>
                                </div>
                                :
                                <div className="row-sm-9">
                                    <form role="form" style={{ overflow: 'auto' }} onChange={this.checkError}>
                                        <div className="form-group">
                                            <label>{t("labels.motive")}</label>
                                            <textarea
                                                ref={(textarea) => { this.state.reason = textarea }}
                                                placeholder={t("labels.motive")}
                                                className="form-control"
                                                style={{ resize: 'vertical' }}
                                                required
                                            />
                                            <span className="help-block m-b-none">
                                                {t("labels.motiveSub")}
                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <label>{t("labels.comment")}</label>
                                            <textarea
                                                ref={(textarea) => { this.state.description = textarea }}
                                                placeholder={t("labels.comment")}
                                                className="form-control"
                                                style={{ resize: 'vertical' }}
                                            />
                                            <span className="help-block m-b-none">
                                                {t("labels.commentSub")}
                                            </span>
                                        </div>
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="pull-left">
                        <Button
                            size="lg"
                            color="default"
                            label={t("buttons.filesClean")}
                            onClick={() => this.onOpenFilesModal()}
                            style={{ marginRight: 5 }}
                        />
                        {this.state.openFiles ?
                            <FilesModal
                                open={this.state.openFiles}
                                type={"TaskInstances"}
                                obj_id={this.props.task.id}
                                onClose={this.onCloseFilesModal}
                                extra={{ key: 'isSolution', value: true }}
                                editable={true}
                            />
                            : null
                        }
                    </div>
                    <div className="pull-right">
                        <Button onClick={() => this.handleClose()} color="default" label={t("buttons.cancel")} />
                        &nbsp;
                        <Button
                            onClick={() => this.state.error ? null : this.sendData()}
                            color="primary"
                            label={t("buttons.endTask")}
                            extra={this.state.error ? "disabled" : ""}
                        />
                    </div>
                </div>
            </Modal>
        )
    }
}

export default translate('tasks')(EndModal)
