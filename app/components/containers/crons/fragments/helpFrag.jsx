import React from 'react';
import Modal from 'react-responsive-modal'
import Button from '../../../common/buttons/button'


class HelpFrag extends React.Component {

    render() {
        return (
            <Modal open={this.props.open} onClose={this.props.onClose} showCloseIcon={false} little>
                <div className="modal-form">
                    <div className="modal-dialog" style={{ margin: 'auto' }}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div>
                                        <h3>Guide</h3>
                                        Small guide about the periodicity syntax
                                        </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-12">
                                    <div>
                                        <p>To create a period object, you must understand how the logic and syntax work.</p>
                                        <p>For each period type (year, month, month days, ...) you have the options of <b>'every'</b> and <b>'at'</b>.</p>
                                        <p>For <b>'every'</b>, you can choose something like <i>'every day'</i>, or <i>'every minute'</i>.</p>
                                        <p>For <b>'at'</b>, you can choose a specific time like <i>'2nd of each month'</i>.</p>
                                        <p>As for the syntax, please read the following table:</p>
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="text-center">Input</th>
                                                <th className="text-center">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-center col-sm-4">
                                                    <i>(Year)</i><b> 'At' '2019'</b>
                                                </td>
                                                <td className="text-center col-sm-8">
                                                    Since we're talking about the years description, with the 'at' option, this means that the task while fire only in 2019.
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td className="text-center col-sm-4">
                                                    <i>(Month)</i><b> 'Every' '2'</b>
                                                </td>
                                                <td className="text-center col-sm-8">
                                                    Since we're talking about the months description, with the 'every' option, this means that the task while fire every two months in the year.
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td className="text-center col-sm-4">
                                                    <i>(Month Days)</i><b> 'At' '5'</b>
                                                </td>
                                                <td className="text-center col-sm-8">
                                                    Since we're talking about the month days, with the 'at' option, this means that the task while fire precisely at the 5th day of each month.
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td className="text-center col-sm-4">
                                                    <i>(Week Days)</i><b> 'At' 'mon'</b>
                                                </td>
                                                <td className="text-center col-sm-8">
                                                    Since we're talking about the week days, with the 'at' option, this means that the task while fire every Monday.
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td className="text-center col-sm-4">
                                                    <i>(Hours)</i><b> 'Every' '3-5'</b>
                                                </td>
                                                <td className="text-center col-sm-8">
                                                    Since we're talking about the hours description, with the 'every' option, this means that the task while fire only between 3 AM and 5:59 AM.
                                                    </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <hr />
                                    <div>
                                        <p>With this syntax, you can create multiple rules, and there a few default options for you to choose from.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ float: 'right' }}>
                        <Button onClick={() => this.props.onClose()} color="default" label="Ok" />
                    </div>
                </div>
            </Modal>
        )
    }
}

export default HelpFrag
