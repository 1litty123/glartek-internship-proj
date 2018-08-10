import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import api from '../../../utils/api'
import axios from 'axios'
import cronstrue from 'cronstrue'
import {v1 as uuidv1} from 'uuid'

var instance = {
    baseURL: 'http://192.168.65.50:3000/api',
}

const _token = localStorage.getItem('_token')

class Date extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: moment(),
            cronFormat: moment().format('mm HH DD MM YYYY'),
        }
        this.handleChange = this.handleChange.bind(this)
        this.convertToCron = this.convertToCron.bind(this)
        this.createPredefinedTime = this.createPredefinedTime.bind(this)
        this.getPredefinedTimeId = this.getPredefinedTimeId.bind(this)
    }
    componentDidMount() {
        this.convertToCron()
    }
    getPredefinedTimeId() {
        this.props.predefinedTimeId(this.state.id)
    }
    createPredefinedTime() {
        return axios({
            method: 'post',
            url: instance.baseURL+"/PredefinedTimes?access_token="+_token,
            headers: {'X-Custom-Header': 'foobar'},
            data: { 
                "name": uuidv1(),
                "description": this.state.cronDescription,
                "expression": this.state.cronExpression
             },
        })
        .then(function(response) {
            console.log(response.data.id)
            this.setState({
                id: response.data.id
            })
            this.getPredefinedTimeId()
        }.bind(this))
        .catch(function(error) {
            console.log(error)
        })
    }
    handleChange(date) {
        this.setState({
            startDate: date,
            cronFormat: date.format('mm HH DD MM YYYY')
        })
        this.convertToCron()
    }
    convertToCron() {
        let cron_array = this.state.cronFormat.split(' ')
        let cronExpression = '0 ' + cron_array[0] + ' ' + cron_array[1] + ' ' + cron_array[2] + ' ' + cron_array[3] + ' * ' + cron_array[4]
        let cronDescription = cronstrue.toString(cronExpression)
        this.setState({
            cronExpression: cronExpression,
            cronDescription: cronDescription
        })
    }

    render() {
        if (!this.state.cronExpression && !this.state.cronDescription) {
            return 'loading...'
        }
        return (
        <div>
        <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
        showTimeSelect
        dateFormat="LLL"
        />
        <button type="button" onClick={this.createPredefinedTime}>Submit</button>
        </div>
    )
    }
}

export default Date