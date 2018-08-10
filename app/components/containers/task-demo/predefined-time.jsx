import React from 'react'
import api from '../../../utils/api'
import axios from 'axios'
import Date from './date-picker'

var instance = {
    baseURL: 'http://192.168.65.50:3000/api',
}

const _token = localStorage.getItem('_token')

class PredefinedTime extends React.Component {

    render() {
        return (<div>
            <Date/>
        </div>)
    }
}

export default PredefinedTime