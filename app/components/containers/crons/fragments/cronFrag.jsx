import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import 'icheck/skins/all.css'
import moment from 'moment'
import Consts from '../../../../utils/consts'
import Button from '../../../common/buttons/button'
import { createPeriod } from '../../periods/periodActions'
import Help from './helpFrag'

const INITIAL_STATE = {
    seconds: { value: "0", type: 'at' },
    minutes: { value: "*", type: null },
    hours: { value: "*", type: null },
    monthDays: { value: "*", type: null },
    month: { value: "*", type: null },
    weekDays: { value: "*", type: null },
    year: { value: "*", type: null },
    expression: "0 * * * * * *",
    readable: null,
    openHelp: false,
    error: true,
    expError: true,
    expErrorMessage: "No expression parsed! Please click 'Parse' first to validate the current expression"
}

class NewCron extends React.Component {

    constructor(props) {
        super(props)

        this.state = INITIAL_STATE

        this.months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
        this.weeks = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        this.MAX_VALUE = 10000
        this.MIN_VALUE = 2017
    }

    checkError = () => {
        this.setState({
            error: !this.refs.name.value || !this.refs.description.value
        })
    }

    ateverySelect = (ref) => {
        return (
            <select ref={ref}>
                <option key="every" value="every">
                    Every
                </option>
                <option key="at" value="at">
                    At
                </option>
            </select>
        )
    }

    textField = (ref) => {
        return (
            <div>
                <input ref={ref} type="text" className="form-control text-center" placeholder="*" />
            </div>
        )
    }

    transformDataToExpression = () => {
        let expression = "0 "

        const m = this.state.minutes
        //caso esteja o default, não vale a pena percorrer o resto
        if (m.value === "*") expression += "* "
        else {
            //caso a escolha seja every e o valor seja numérico (e.g. '2'), então entende-se que isto seja 'de 2 em 2 dias do mês', e não 'todos os 2nd'. Para essa opção, há o 'at' '2'.
            if (m.type === "every" && !isNaN(parseInt(m.value)))
                expression += "1-59/" + m.value + " "
            //senão, e caso a escolha seja 'every' e não exista um hífen inserido, colocar '*/'
            else expression += (m.type === "every" && m.type.indexOf('-') !== -1 ? "*/" : "") + m.value + " "
        }

        const h = this.state.hours
        //caso esteja o default, não vale a pena percorrer o resto
        if (h.value === "*") expression += "* "
        else {
            //caso a escolha seja every e o valor seja numérico (e.g. '2'), então entende-se que isto seja 'de 2 em 2 dias do mês', e não 'todos os 2nd'. Para essa opção, há o 'at' '2'.
            if (h.type === "every" && !isNaN(parseInt(h.value)))
                expression += "1-23/" + h.value + " "
            //senão, e caso a escolha seja 'every' e não exista um hífen inserido, colocar '*/'
            else expression += (h.type === "every" && h.type.indexOf('-') !== -1 ? "*/" : "") + h.value + " "
        }

        const md = this.state.monthDays
        //caso esteja o default, não vale a pena percorrer o resto
        if (md.value === "*") expression += "* "
        else {
            //caso a escolha seja every e o valor seja numérico (e.g. '2'), então entende-se que isto seja 'de 2 em 2 dias do mês', e não 'todos os 2nd'. Para essa opção, há o 'at' '2'.
            if (md.type === "every" && !isNaN(parseInt(md.value)))
                expression += "1-31/" + md.value + " "
            //senão, e caso a escolha seja 'every' e não exista um hífen inserido, colocar '*/'
            else expression += (md.type === "every" && md.type.indexOf('-') !== -1 ? "*/" : "") + md.value + " "
        }

        const M = this.state.month
        if (M.value === "*") expression += "* "
        else {
            //caso a escolha seja every e o valor seja numérico (e.g. '2'), então entende-se que isto seja 'de 2 em 2 meses', e não 'em Fevereiro'. Para essa opção, há o 'at' '2'.
            if (M.type === "every" && !isNaN(parseInt(M.value)))
                expression += "1-12/" + M.value + " "
            //senão, e caso a escolha seja 'every' e não exista um hífen inserido, colocar '*/'
            else expression += (M.type === "every" && M.type.indexOf('-') !== -1 ? "*/" : "") + M.value + " "
        }

        const wd = this.state.weekDays
        //caso esteja o default, não vale a pena percorrer o resto
        if (wd.value === "*") expression += "* "
        else {
            //caso a escolha seja every e o valor seja numérico (e.g. '2'), então entende-se que isto seja 'de 2 em 2 meses', e não 'em Fevereiro'. Para essa opção, há o 'at' '2'.
            if (wd.type === "every" && !isNaN(parseInt(wd.value)))
                expression += "0-6/" + wd.value
            //senão, e caso a escolha seja 'every' e não exista um hífen inserido, colocar '*/'
            else expression += (wd.type === "every" && wd.type.indexOf('-') !== -1 ? "*/" : "") + wd.value
        }

        const y = this.state.year
        if (y.value === "*") expression += "*"
        else {
            //caso a escolha seja every e o valor seja numérico (e.g. '2'), então entende-se que isto seja 'de 2 em 2 anos', e não 'no ano 2'. Para essa opção, há o 'at' '2'.
            if (y.type === "every" && !isNaN(parseInt(y.value)))
                expression += "*/" + y.value + " "
            //senão, e caso a escolha seja 'every' e não exista um hífen inserido, colocar '*/'
            else expression += (y.type === "every" && y.type.indexOf('-') !== -1 ? "*/" : "") + y.value + " "
        }

        return expression
    }

    readExpression = (exp) => {

        /* console.log(exp) */

        try {

            //test seconds field
            const s = this.state.seconds.value
            const _s = +s
            if ((s !== "*" && isNaN(_s)) || (_s < 0 || _s > 59))
                throw new Error("The 'seconds' field should be a value between 0 and 59")

            //test minutes field
            const m = this.state.minutes.value
            const _m = +m
            if ((m !== "*" && isNaN(_m)) || (_m < 0 || _m > 59))
                throw new Error("The 'minutes' field should be a value between 0 and 59")

            //test hours field
            const h = this.state.hours.value
            const _h = +h
            if ((h !== "*" && isNaN(_h)) || (_h < 0 || _h > 23))
                throw new Error("The 'hours' field should be a value between 0 and 23")

            //test month days field
            const md = this.state.monthDays.value
            const _md = +md
            if ((md !== "*" && isNaN(_md)) || (_md < 1 && _md > 31))
                throw new Error("The 'month days' field should be a value between 1 and 31")

            //test months field
            const M = this.state.month.value
            const _M = +M
            if (!isNaN(_M) && (_M < 1 || _M > 12))
                throw new Error("The 'month' field should be a value between 1 and 12")

            //test week days field
            const wd = this.state.weekDays.value
            const _wd = +wd
            if (!isNaN(_wd) && (_wd < 0 || _wd > 6))
                throw new Error("The 'week days' field should be a value between 0 and 6")

            //test year field
            const y = this.state.year.value
            const _y = +y
            if ((y !== "*" && isNaN(_y)) || (_y < this.MIN_VALUE && _y > this.MAX_VALUE))
                throw new Error("The 'year' field should be a value between" + this.MIN_VALUE + " and " + this.MAX_VALUE)

            //after validating the fields, we should validate the expression
            const splitExp = exp.split(' ')

            //test use of / and - symbols
            var test = splitExp.filter(e => e.split('-').length > 2 || e.split('/').length > 2) > 0
            if (test)
                throw new Error("One or more fields has more than one symbols ('/','-'). Maximum symbols per field is 1")

            //test use of *
            test = splitExp.filter(e => e.length > 1 && e.indexOf('*') !== -1) > 0
            if (test)
                throw new Error("One or more fields has a numeric value and an asterisk ('*'). This is invalid, an asterisk is independent to the other values")

            //if all data is fine, try to parse expression into readable text
            //ref: https://www.npmjs.com/package/cronstrue - permite a utilização de locale, através do pacote 'cronstrue/i18n'
            var cronstrue = require('cronstrue')


            return {
                text: cronstrue.toString(exp),
                error: false
            }
        } catch (err) {
            return {
                text: null,
                error: true,
                errorMessage: err.message
            }
        }
    }

    parse = () => {
        this.setState({
            minutes: {
                value: this.refs.m_t.value || "*",
                type: this.refs.m.value
            },
            hours: {
                value: this.refs.h_t.value || "*",
                type: this.refs.h.value
            },
            monthDays: {
                value: this.refs.md_t.value || "*",
                type: this.refs.md.value
            },
            month: {
                value: this.refs.M_t.value || "*",
                type: this.refs.M.value
            },
            weekDays: {
                value: this.refs.wd_t.value || "*",
                type: this.refs.wd.value
            },
            year: {
                value: this.refs.y_t.value || "*",
                type: this.refs.y.value
            }
        }, () => {

            let expression = this.transformDataToExpression()

            const read = this.readExpression(expression)

            let now = moment()

            if (this.state.year.type.toLowerCase() === "at" && !isNaN(this.state.year.value))
                now.year(this.state.year.value)
            if (this.state.month.type.toLowerCase() === "at" && !isNaN(this.state.month.value))
                now.month(this.state.month.value - 1) //interface accepts 1-12, moment.js accepts 0-11
            if (this.state.monthDays.type.toLowerCase() === "at" && !isNaN(this.state.monthDays.value))
                now.date(this.state.monthDays.value)
            if (this.state.weekDays.type.toLowerCase() === "at" && !isNaN(this.state.weekDays.value))
                now.day(this.state.weekDays.value)
            if (this.state.hours.type.toLowerCase() === "at" && !isNaN(this.state.hours.value))
                now.hour(this.state.hours.value)
            if (this.state.minutes.type.toLowerCase() === "at" && !isNaN(this.state.minutes.value))
                now.minute(this.state.minutes.value)

            const utcNow = now.local(now).utc()

            this.setState({
                year: {
                    value: this.state.year.type.toLowerCase() === "at" && !isNaN(this.state.year.value) ? utcNow.year() : this.state.year.value,
                    type: this.state.year.type
                },
                month: {
                    value: this.state.month.type.toLowerCase() === "at" && !isNaN(this.state.month.value) ? utcNow.month() + 1 : this.state.month.value,
                    type: this.state.month.type
                },
                weekDays: {
                    value: this.state.weekDays.type.toLowerCase() === "at" && !isNaN(this.state.weekDays.value) ? utcNow.day() : this.state.weekDays.value,
                    type: this.state.weekDays.type
                },
                monthDays: {
                    value: this.state.monthDays.type.toLowerCase() === "at" && !isNaN(this.state.monthDays.value) ? utcNow.date() : this.state.monthDays.value,
                    type: this.state.monthDays.type
                },
                hours: {
                    value: this.state.hours.type.toLowerCase() === "at" && !isNaN(this.state.hours.value) ? utcNow.hour() : this.state.hours.value,
                    type: this.state.hours.type
                },
                minutes: {
                    value: this.state.minutes.type.toLowerCase() === "at" && !isNaN(this.state.minutes.value) ? utcNow.minute() : this.state.minutes.value,
                    type: this.state.minutes.type
                },
            }, () => {

                expression = this.transformDataToExpression()

                this.refs.description.value = read.text
                this.refs.name.value = read.text

                this.checkError()

                this.setState({
                    expression: expression,
                    readable: read.text,
                    expError: read.error,
                    expErrorMessage: read.errorMessage
                })
            })
        })
    }

    onOpenHelp = () => {
        this.setState({
            openHelp: true
        })
    }

    onCloseHelp = () => {
        this.setState({
            openHelp: false
        })
    }

    save = () => {

        //parse expression

        const periodData = {
            name: this.refs.name.value,
            description: this.refs.description.value,
            expression: this.state.expression
        }

        /* console.log(this.state.expression) */

        const params = "?filter[where][name]=" + periodData.name
        axios.get(Consts.API_URL + "/PredefinedTimes" + params + "&accesstoken=" + JSON.parse(localStorage.getItem('_user')).id)
            .then(resp => {
                if (resp.data.length > 0)
                    swal("A period with name '" + periodData.name + "' already exists. No period created!", {
                        icon: "warning"
                    })
                else {
                    axios.post(Consts.API_URL + "/PredefinedTimes?accesstoken=" + JSON.parse(localStorage.getItem('_user')).id, periodData)
                        .then(resp => {
                            swal("Cron saved!", {
                                icon: "success"
                            })
                            this.props.callback(resp.data)
                        }).catch(err => {
                            swal("Something went wrong!!", {
                                icon: "warning"
                            })
                            console.log(err.response.data)
                        })
                }
            })

    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-center">Year</th>
                                <th className="text-center">Month</th>
                                <th className="text-center">Month Days</th>
                                <th className="text-center">Week Days</th>
                                <th className="text-center">Hours</th>
                                <th className="text-center">Minutes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="m-b text-center">{this.ateverySelect("y")}</td>
                                <td className="m-b text-center">{this.ateverySelect("M")}</td>
                                <td className="m-b text-center">{this.ateverySelect("md")}</td>
                                <td className="m-b text-center">{this.ateverySelect("wd")}</td>
                                <td className="m-b text-center">{this.ateverySelect("h")}</td>
                                <td className="m-b text-center">{this.ateverySelect("m")}</td>
                            </tr>
                            <tr>
                                <td>
                                    {this.textField("y_t")}
                                    <span className="help-block text-center" >
                                        Types accepted: '2018-2019' '2018,2020,...' '2018'
                                        Minimum: 1970, Maximum: 10000
                                    </span>
                                </td>
                                <td>
                                    {this.textField("M_t")}
                                    <span className="help-block text-center" >
                                        Types accepted: '1-12' '1,3,...' '1'
                                        Minimum: 1, Maximum: 12
                                    </span>
                                </td>
                                <td>
                                    {this.textField("md_t")}
                                    <span className="help-block text-center" >
                                        Types accepted: '1-31' '1,3,...' '1'
                                        Minimum: 1, Maximum: 31
                                    </span>
                                </td>
                                <td>
                                    {this.textField("wd_t")}
                                    <span className="help-block text-center" >
                                        Types accepted: '0-6' '1,3,...' '1'
                                        Minimum: 0, Maximum: 6
                                    </span>
                                </td>
                                <td>
                                    {this.textField("h_t")}
                                    <span className="help-block text-center" >
                                        Types accepted: '1-23' '1,3,...' '1'
                                        Minimum: 0, Maximum: 23
                                    </span>
                                </td>
                                <td>
                                    {this.textField("m_t")}
                                    <span className="help-block text-center" >
                                        Types accepted: '1-59' '1,3,...' '1'
                                        Minimum: 0, Maximum: 59
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="form-group" style={{ marginRight: 0 }}>
                    <div style={{ float: 'right' }}>
                        <Button onClick={() => this.onOpenHelp()} color="default" label="Help" />
                        &nbsp;
                        <Button onClick={() => this.parse()} color="primary" label="Parse" />
                    </div>
                </div>
                <Help open={this.state.openHelp} onClose={this.onCloseHelp} />
                <div className="form-group" style={{ marginRight: 0 }}>
                    <div style={{ float: 'right' }}>
                        <label>Expression: {this.state.expError ? <span className="text-navy">{this.state.expErrorMessage}</span> : this.state.readable}</label>
                    </div>
                </div>
                <div className="hr-line-dashed" />
                <div className="form-group">
                    <label className="col-sm-2 control-label" >
                        Name
                    </label>
                    <div className="col-sm-10">
                        <input
                            ref="name"
                            onChange={(e) => this.checkError()}
                            className="form-control"
                            type="text"
                            placeholder="Period name"
                        />
                        <span className="help-block m-b-none">
                            A name for the period to be created.
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">
                        Description
                    </label>
                    <div className="col-sm-10">
                        <textarea
                            ref="description"
                            onChange={(e) => this.checkError()}
                            className="form-control"
                            placeholder="Period description"
                            style={{ resize: 'vertical', maxHeight: '500px', minHeight: '50px' }}
                        />
                        <span className="help-block m-b-none">
                            A short description about this period.
                        </span>
                    </div>
                </div>
                <div className="form-group" style={{ marginRight: 0 }}>
                    <div style={{ float: 'right' }}>
                        <Button
                            onClick={() => !this.state.expError && !this.state.error ? this.save() : null}
                            color="primary"
                            label="Save Period"
                            extra={!this.state.expError && !this.state.error ? "" : "disabled"}
                        />
                    </div>
                </div>
            </div>
        )
    }

}

const mapDispatchToProps = dispatch => bindActionCreators({ createPeriod }, dispatch)

export default connect(null, mapDispatchToProps)(NewCron)
