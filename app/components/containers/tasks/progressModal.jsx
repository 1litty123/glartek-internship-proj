import React from 'react';
import Modal from 'react-responsive-modal'
import moment from 'moment'
import { translate } from 'react-i18next'
import Button from '../../common/buttons/button'
import Checkpoint from '../checklists/Checkpoint'

const INITIAL_STATE = {
    checkpointsDone: false
}

class ProgressModal extends React.Component {

    constructor(props) {
        super(props)

        this.state = INITIAL_STATE
        this.checkpoints = []
        this.refresh = true
    }

    componentDidMount() {
        this.checkpoints = this.props.checklist._checkpoints.map(c => {
            return {
                id: c.id,
                state: c.state, //default: pending
                data: c
            }
        })
    }

    checkCheckpointsState = () => {
        this.setState({
            checkpointsDone: this.checkpoints.filter(cp => cp.state === 'pending').length === 0
        })
    }

    updateCheckpoint = (checkpoint) => {
        this.checkpoints.filter(c => c.id === checkpoint.id)[0].state = "done"
        this.checkCheckpointsState()
    }

    renderCheckpoints = () => {
        const pending = this.props.checklist._checkpoints.filter(checkpoint => checkpoint.state === "pending")
        if (pending.length === 0 && this.refresh) {
            this.checkCheckpointsState()
            this.refresh = false
        }
        return pending.sort((a, b) => a.order > b.order).map((checkpoint, key) => (
            <Checkpoint
                key={key}
                checkpoint={checkpoint}
                checklist={this.props.checklist}
                onCreateTask={this.onOpenCreateTask}
                onChange={() => this.updateCheckpoint(checkpoint)}
            />
        ))
    }

    render() {
        const { t } = this.props;
        const diff = moment(this.props.checklist.tta).diff(moment())
        let canAbort = diff > 0
        if (diff > 0)
            //se o valor for negativo, tta já expirou
            setTimeout(() => {
                canAbort = false
                this.forceUpdate()
            }, diff)


        return (
            <Modal open={this.props.open} onClose={this.props.onClose} showCloseIcon={false} little closeOnEsc={false} closeOnOverlayClick={false}>
                <div className="modal-form">
                    <div className="modal-dialog" style={{ margin: 'auto' }}>
                        <div className="modal-body">
                            <div className="row">
                                <form role="form">
                                    <div id="vertical-timeline" className="vertical-container dark-timeline no-margins">
                                        {this.renderCheckpoints()}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div style={{ float: 'right' }}>
                        {this.props.checklist.state === "wip" && canAbort ?
                            <Button
                                color="danger"
                                label={t("buttons.abort")}
                                style={{ marginRight: 5 }}
                                onClick={() => this.props.onAbort(this.props.checklist)}
                            /> : null
                        }
                        &nbsp;
                        {this.props.checklist.state === "wip" ?
                            <Button
                                color="default"
                                label={t("buttons.pause")}
                                style={{ marginRight: 5 }}
                                onClick={() => this.props.onPause(this.props.checklist)}
                            /> : null
                        }
                        &nbsp;
                        <Button
                            onClick={() => this.state.checkpointsDone ? this.props.callback(this.props.checklist) : null}
                            color="primary"
                            label={t("buttons.finishChecklist")}
                            extra={this.state.checkpointsDone ? '' : 'disabled'}
                        />
                    </div>
                </div>
            </Modal>
        )
    }
}

export default translate('tasks')(ProgressModal)
