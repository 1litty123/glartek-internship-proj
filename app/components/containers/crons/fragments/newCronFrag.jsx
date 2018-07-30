import React from 'react'
import moment from 'moment'
import 'icheck/skins/all.css'
import 'react-toggle/style.css'
import Toggle from 'react-toggle'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Checkbox } from 'react-icheck'
import { translate } from 'react-i18next'
import i18next from 'i18next'
import Button from '../../../common/buttons/button'
import Span from '../../../common/icons/span'
import { createCron, getCronByName } from '../../crons/cronActions'

const INITIAL_STATE = {
    title: "",
    monthDay: 1,
    month: 0,
    year: 0,
    hour: 0,

    repeatable: false,
    every: 1,
    period: "day",
    repeatDays: [false, false, false, false, false, false, false], /* S,M,T,W,T,F,S */

    limit: true,
    invalidDate: false,
    error: true
}

class NewCron extends React.Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE
        this.now = moment()

        this.yearOptions = []
        this.monthOptions = []
        this.monthDayOptions = []
        this.hourOptions = []

        this.periodOptions = ["minute", "hour", "day", "week", "month", "year"]
    }

    componentDidMount() {
        this.setState({
            monthDay: this.now.date(),
            month: +moment().set('month', this.now.month()).month(),
            year: this.now.year(),
            hour: moment().startOf('hour').add(1, 'h').format("HHmm")
        }, () => {
            this.yearOptions = Array.from(new Array(5), (val, index) => this.state.year + index)
            this.monthOptions = Array.from(new Array(12), (val, index) => index)
            this.monthDayOptions = Array.from(new Array(moment().set('month', this.state.month).daysInMonth()), (val, index) => index + 1)
            this.hourOptions = Array.from(new Array(48), (val, index) => moment().startOf('day').add(30 * index, 'm').format("HHmm"))
            this.forceUpdate()
        })
    }
    checkError = () => {
        const diff = this.checkValidDate()
        this.setState({
            invalidDate: diff > 0,
            error: diff > 0 || this.state.title === ""
        }, () => this.forceUpdate())
    }
    checkValidDate = () => {
        const now = moment()
        const cronTime = moment().set({
            'year': this.state.year,
            'month': this.state.month,
            'date': this.state.monthDay,
            'hour': this.state.hour.slice(0, 2),
            'minute': this.state.hour.slice(2, 4)
        })
        return now.diff(cronTime)
    }

    renderYearOptions = () => {
        const data = this.yearOptions || []
        if (data !== []) {
            return data.map(reg => (
                <option key={reg} value={reg}>
                    {reg}
                </option>
            )
            )
        } else {
            return []
        }
    }
    renderMonthOptions = () => {
        const { t } = this.props
        const data = this.monthOptions || []
        if (data !== []) {
            return data.map(reg => {
                const monthString = t("months." + reg)/* moment().set('month', reg).format("MMMM") */
                return (
                    <option key={reg} value={reg}>
                        {monthString}
                    </option>
                )
            })
        } else {
            return []
        }
    }
    renderMonthDayOptions = () => {
        const data = this.monthDayOptions || []
        if (data !== []) {
            return data.map(reg => (
                <option key={reg} value={reg}>
                    {reg}
                </option>
            )
            )
        } else {
            return []
        }
    }
    renderHourOptions = () => {
        const data = this.hourOptions || []
        if (data !== []) {
            return data.map(reg => {
                const hourString = reg.slice(0, 2) + ":" + reg.slice(2, 4)
                return (
                    <option key={reg} value={reg}>
                        {hourString}
                    </option>
                )
            })
        } else {
            return []
        }
    }
    renderPeriodOptions = () => {
        const { t } = this.props
        const data = [t("measures.minute"), t("measures.hour"), t("measures.day"), t("measures.week"), t("measures.month"), t("measures.year")]
        return data.map(reg => (
            <option key={reg} value={reg}>
                {reg + (i18next.language === "pt" && reg === t("measures.month") ? "(es)" : "(s)")}
            </option>
        ))
    }
    /* renderRepeatMonthOptions = () => {
        let data = []

        const day = this.state.monthDay
        const weekDay = moment().set('month', this.state.month).set('day', day).format("dddd")
        const week = (moment().set('month', this.state.month).daysInMonth() - day) % 6
        let weekNumber = ""
        if (week == 1) weekNumber = "first"
        if (week == 2) weekNumber = "second"
        if (week == 3) weekNumber = "third"
        if (week == 4) weekNumber = "last"

        console.log(day)
        console.log(weekDay)
        console.log(week)
        console.log(weekNumber)

        const option1 = "Monthly on day " + day
        const option2 = "Monthly on the " + weekNumber + " " + weekDay

        data.push(option1)
        data.push(option2)

        if (data != []) {
            return data.map(reg => (
                <option key={reg} value={reg}>
                    {reg}
                </option>
            )
            )
        }
    } */

    updateYear = (e) => {
        this.setState({
            year: e.target.value
        }, this.checkError)
    }
    updateMonth = (e) => {
        const _now = moment().set('month', e.target.value).set('year', this.state.year)
        this.monthDayOptions = Array.from(new Array(_now.daysInMonth()), (val, index) => index + 1)
        if (this.state.monthDay > _now.daysInMonth()) {
            const current = this.state.monthDay - _now.daysInMonth()
            this.setState({
                monthDay: current
            })
        }
        this.setState({
            month: _now.month()
        }, this.checkError)
    }
    updateMonthDay = (e) => {
        this.setState({
            monthDay: e.target.value
        }, this.checkError)
    }
    updateHour = (e) => {
        this.setState({
            hour: e.target.value
        }, this.checkError)
    }
    updateRepeatable = () => {
        this.setState({
            repeatable: !this.state.repeatable
        })
    }
    updateRepeatWeek = (day) => {
        let repeatDays = this.state.repeatDays
        repeatDays[day] = !repeatDays[day]
        this.setState(repeatDays/* , () => console.log(this.state.repeatDays) */)
    }
    /* updateRepeatMonth = (day) => {
        let repeatDays = this.state.repeatDays
        repeatDays[day] = !repeatDays[day]
        this.setState(repeatDays)
    } */
    updateLimit = () => {
        this.setState({
            limit: !this.state.limit
        })
    }

    convertCron = async () => {
        let original = moment().set({
            'year': this.state.year,
            'month': this.state.month,
            'date': this.state.monthDay,
            'hour': this.state.hour.slice(0, 2),
            'minute': this.state.hour.slice(2, 4),
        })
        const converted = original.local(original).utc()
        return {
            year: converted.year(),
            month: converted.month() + 1, //moment.js uses 0-11, cron uses 1-12
            monthDay: converted.date(),
            hour: converted.hour(),
            minute: converted.minute()
        }
    }
    saveCron = async () => {

        const st = this.state
        const { t } = this.props

        // check for error one last time
        const diff = this.checkValidDate()
        if (diff >= 0) {
            swal(this.props.t("swals.saveCronError"), {
                icon: "warning",
            })
            return
        }

        // check for previous existence
        try {
            const exists = await this.props.getCronByName(st.title)
            if (exists.data.length > 0) {
                swal(this.props.t("swals.saveCronErrorError", st.title), {
                    icon: "warning"
                })
                return
            }
        } catch (err) {
            swal(this.props.t("swals.saveCronErrorErrorError"), {
                icon: "warning"
            })
            console.log(err)
            return
        }


        const conv = await this.convertCron()
        // http://www.nncron.ru/help/EN/working/cron-format.htm
        let cron = ""
        if (!st.repeatable)
            cron = "0 " + conv.minute + " " + conv.hour + " " + conv.monthDay + " " + conv.month + " * " + conv.year
        else {
            //<Second> <Minute> <Hour> <Day_of_the_Month> <Month_of_the_Year> <Day_of_the_Week> <Year>
            let relation = st.every === 1 ? (st.period === t("measures.week") ? "*/7" : "*") : ("*/" + (st.period === t("measures.week") ? st.every * 7 : st.every))
            switch (st.period) {
                case t("measures.minute"):
                    cron = "0 " + relation + " " + conv.hour + "-23 " + (this.state.limit ? conv.monthDay + " " + conv.month + " * " + conv.year : "* * * *")
                    break
                case t("measures.hour"):
                    cron = "0 " + conv.minute + " " + relation + " " + (this.state.limit ? conv.monthDay + " " + conv.month + " * " + conv.year : "* * * *")
                    break
                case t("measures.day"):
                    cron = "0 " + conv.minute + " " + conv.hour + " " + relation + " " + (this.state.limit ? conv.month + " * " + conv.year : "* * *")
                    break
                case t("measures.week"):
                    let days = ""
                    this.state.repeatDays.map((d, i) => {
                        const firstI = this.state.repeatDays.indexOf(true)
                        if (d) {
                            const sep = firstI === i ? "" : ","
                            days += sep + moment().day(i).format("ddd")
                        }
                    })
                    const _cron = conv.month + " " + (days === "" ? "*" : days) + " " + conv.year
                    cron = "0 " + conv.minute + " " + conv.hour + " " + relation + " " + (this.state.limit ? _cron : "* " + (days === "" ? "*" : days) + " *")
                    break
                case t("measures.month"):
                    cron = "0 " + conv.minute + " " + conv.hour + " " + conv.monthDay + " " + relation + " * " + (this.state.limit ? conv.year : "*")
                    break
                case t("measures.year"):
                    cron = "0 " + conv.minute + " " + conv.hour + "-23 " + conv.monthDay + " " + conv.month + " * " + relation
                    break
            }
        }

        const cronData = {
            name: st.title,
            description: st.title,
            expression: cron
        }
        try {
            await this.props.createCron(cronData)
            swal(this.props.t("swals.saveCronSuccess"), {
                icon: "success"
            })
        } catch (err) {
            swal(this.props.t("swals.saveError"), {
                icon: "warning"
            })
            return
        }
        this.props.callback()
    }

    render() {
        const { t } = this.props;
        const getPrefix = (day) => {
            switch (day) {
                case 1:
                    return t("prefixes.st")
                case 2:
                    return t("prefixes.nd")
                case 3:
                    return t("prefixes.rd")
                default:
                    return t("prefixes.th")
            }
        }
        const getWeekDayString = () => {
            const firstI = this.state.repeatDays.indexOf(true)
            const lastI = this.state.repeatDays.lastIndexOf(true)
            let str = this.state.repeatDays.filter(d => d).length > 0 ? t("times.commaOnlyOn") : ""
            this.state.repeatDays.map((day, index) => {
                if (day) {
                    let sep = ""
                    if (firstI !== index)
                        sep = lastI === index ? t("times.and") : ", "
                    const weekDay = t("weekdays.exp" + moment().day(index).format("dddd"))
                    str += sep + weekDay
                }
            })
            return str
        }

        return (
            <div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">
                        {t("labels.cronTitle")}
                    </label>
                    <div className="col-sm-10">
                        <input
                            className="form-control m-b"
                            value={this.state.title}
                            onChange={(e) => this.setState({ title: e.target.value }, this.checkError)}
                            placeholder={t("labels.cronTitle")} />
                    </div>
                </div>
                <div className="hr-line-dashed" />
                <div className="form-group">
                    <label className="col-sm-2 control-label">
                        {t("labels.on")}
                    </label>
                    <div className="col-sm-2">
                        <select className="form-control m-b" value={this.state.year} onChange={this.updateYear}>
                            {this.renderYearOptions()}
                        </select>
                    </div>
                    <div className="col-sm-2">
                        <select className="form-control m-b" value={this.state.month} onChange={this.updateMonth}>
                            {this.renderMonthOptions()}
                        </select>
                    </div>
                    <div className="col-sm-2">
                        <select className="form-control m-b" value={this.state.monthDay} onChange={this.updateMonthDay}>
                            {this.renderMonthDayOptions()}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">
                        {t("labels.at")}
                    </label>
                    <div className="col-sm-2">
                        <select className="form-control m-b" value={this.state.hour} onChange={this.updateHour}>
                            {this.renderHourOptions()}
                        </select>
                    </div>
                </div>
                {this.state.invalidDate ?
                    <div className="form-group">
                        <div className="col-sm-2" />
                        <label className="col-sm-10" style={{ color: '#ed5666' }}>
                            {t("label.dateWarning")}
                        </label>
                    </div>
                    :
                    null
                }
                <div className="form-group">
                    <label className="col-sm-2 control-label">
                        {t("labels.repeatable")}
                    </label>
                    <div className="col-sm-4">
                        <label className="checkbox-inline i-checks">
                            {/* This Checkbox will throw a warning: Received false for non-boolean attribute cursor.
                                This error is known and acknowledged by the developers. It was done and this is now temporarily corrected.
                                https://github.com/luqin/react-icheck/issues/43
                            */}
                            <Checkbox
                                className="form-control m-b"
                                checkboxClass="icheckbox_square-green"
                                increaseArea="20%"
                                checked={this.state.repeatable}
                                onChange={this.updateRepeatable} />
                        </label>
                    </div>
                </div>
                <div className="hr-line-dashed" />
                {this.state.repeatable ?
                    <div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">
                                {t("labels.repeatEvery")}
                            </label>
                            <div className="col-sm-1">
                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    value={this.state.every}
                                    onChange={(e) => this.setState({ every: +e.target.value })}
                                />
                            </div>
                            <div className="col-sm-2">
                                <select className="form-control m-b" value={this.state.period} onChange={(e) => this.setState({ period: e.target.value })}>
                                    {this.renderPeriodOptions()}
                                </select>
                            </div>
                            {this.state.period === t("measures.minute") ?
                                <label className="control-label">
                                    {(this.state.limit ? t("times.commaOnlyOn")
                                        + t("months." + this.state.month)
                                        + t("times.monthToDay")
                                        + this.state.monthDay
                                        + getPrefix(this.state.monthDay) : "")
                                        + t("times.commaFrom") + this.state.hour.slice(0, 2)
                                        + ":"
                                        + this.state.hour.slice(2, 4)
                                        + t("times.toEnd")}
                                </label>
                                :
                                null
                            }
                            {this.state.period === t("measures.hour") ?
                                <label className="control-label">
                                    {(this.state.limit ? t("times.commaOnlyOn")
                                        + t("months." + this.state.month)
                                        + t("times.monthToDay")
                                        + this.state.monthDay
                                        + getPrefix(this.state.monthDay) : "")
                                        + t("times.commaFrom") + "00:00" + t("times.toEnd")}
                                </label>
                                :
                                null
                            }
                            {this.state.period === t("measures.day") ?
                                <label className="control-label">
                                    {(this.state.limit ? t("times.commaOnlyIn") + t("months." + this.state.month) + t("times.of") + this.state.year : "")}
                                </label>
                                :
                                null
                            }
                            {this.state.period === t("measures.week") ?
                                <label className={"control-label"}>
                                    {/* ", apenas em" <mês> " de " <year> * */}
                                    {(this.state.limit ? t("times.commaOnlyIn") + t("months." + this.state.month) + t("times.of") + this.state.year : "") + getWeekDayString()}
                                </label>
                                :
                                null
                            }
                            {this.state.period === t("measures.month") ?
                                <label className="control-label">
                                    {/* ", no dia " <monthday>  */}
                                    {t("times.commaOnThe")
                                        + this.state.monthDay
                                        + getPrefix(this.state.monthDay)
                                        + (this.state.limit ? t("times.commaOnlyIn") + this.state.year : "")}
                                </label>
                                :
                                null
                            }
                            {this.state.period === t("measures.year") ?
                                <label className="control-label">
                                    {/* ", em " <mês> ", dia "  */}
                                    {t("times.commaOn") + t("months." + this.state.month) + t("times.monthToDay") + this.state.monthDay + getPrefix(this.state.monthDay)}
                                </label>
                                :
                                null
                            }
                        </div>

                        {[t("measures.minute"),
                        t("measures.hour"),
                        t("measures.day"),
                        t("measures.week"),
                        t("measures.month"),
                        t("measures.year")].indexOf(this.state.period) !== -1 ?
                            <div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">
                                        {t("labels.limit")}
                                    </label>
                                    <div className="col-sm-2">
                                        <Toggle
                                            defaultChecked={this.state.limit}
                                            icons={{
                                                checked: <Div text="Y" />,
                                                unchecked: <Div text="N" />,
                                            }}
                                            onChange={() => this.updateLimit()}
                                        />
                                    </div>
                                </div>
                            </div>
                            : null
                        }
                        {this.state.period === t("measures.week") ?
                            <div className="form-group">
                                <label className="col-sm-2 control-label">
                                    {t("labels.repeatOn")}
                                </label>
                                <div className="col-sm-5">
                                    <Toggle
                                        defaultChecked={false}
                                        icons={{
                                            checked: <Div text={t("weekdays.Sunday")} />,
                                            unchecked: <Div text={t("weekdays.Sunday")} />,
                                        }}
                                        onChange={() => this.updateRepeatWeek(0)} />
                                    <Toggle
                                        defaultChecked={false}
                                        icons={{
                                            checked: <Div text={t("weekdays.Monday")} />,
                                            unchecked: <Div text={t("weekdays.Monday")} left={-1} />,
                                        }}
                                        onChange={() => this.updateRepeatWeek(1)} />
                                    <Toggle
                                        defaultChecked={false}
                                        icons={{
                                            checked: <Div text={t("weekdays.Tuesday")} />,
                                            unchecked: <Div text={t("weekdays.Tuesday")} />,
                                        }}
                                        onChange={() => this.updateRepeatWeek(2)} />
                                    <Toggle
                                        defaultChecked={false}
                                        icons={{
                                            checked: <Div text={t("weekdays.Wednesday")} />,
                                            unchecked: <Div text={t("weekdays.Wednesday")} left={-1} />,
                                        }}
                                        onChange={() => this.updateRepeatWeek(3)} />
                                    <Toggle
                                        defaultChecked={false}
                                        icons={{
                                            checked: <Div text={t("weekdays.Thursday")} />,
                                            unchecked: <Div text={t("weekdays.Thursday")} />,
                                        }}
                                        onChange={() => this.updateRepeatWeek(4)} />
                                    <Toggle
                                        defaultChecked={false}
                                        icons={{
                                            checked: <Div text={t("weekdays.Friday")} />,
                                            unchecked: <Div text={t("weekdays.Friday")} />,
                                        }}
                                        onChange={() => this.updateRepeatWeek(5)} />
                                    <Toggle
                                        defaultChecked={false}
                                        icons={{
                                            checked: <Div text={t("weekdays.Saturday")} />,
                                            unchecked: <Div text={t("weekdays.Saturday")} />,
                                        }}
                                        onChange={() => this.updateRepeatWeek(6)} />
                                </div>
                            </div>
                            :
                            null
                        }
                        {/* this.state.period == "month" ?
                            <div className="form-group">
                                <label className="col-sm-2 control-label">
                                    {"Repeat on"}
                                </label>
                                <div className="col-sm-5">
                                    <select className="form-control m-b" value={this.state.period} onChange={(e) => this.setState({ period: e.target.value })}>
                                        {this.renderRepeatMonthOptions()}
                                    </select>
                                </div>
                            </div>
                            :
                            null */
                        }
                        <div className="hr-line-dashed" />
                    </div>
                    : null
                }
                <div className="form-group">
                    <div className="col-sm-12">
                        <Button
                            onClick={() => this.state.error ? null : this.saveCron()}
                            color="primary"
                            label={t("buttons.saveCron")}
                            size="lg"
                            extra={this.state.error ? "pull-right disabled" : "pull-right"} />
                    </div>
                </div>
            </div>
        )
    }

}

class Div extends React.Component {
    render() {
        return (
            <div style={{ marginTop: 5, marginLeft: this.props.left ? this.props.left : 0 }}>
                <Span color={"#00000000"} text={this.props.text} fontSize={14} />
            </div>
        )
    }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => bindActionCreators({ createCron, getCronByName }, dispatch)

export default compose(translate('cronManager'), connect(mapStateToProps, mapDispatchToProps))(NewCron)
