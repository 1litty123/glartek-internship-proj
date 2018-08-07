import React  from "react"
import api from '../../../utils/api'
import axios from 'axios'

var instance = {
    baseURL: 'http://192.168.65.50:3000/api',
}

const _token = JSON.parse(localStorage.getItem('_user')).id

class TaskDemo extends React.Component {
    constructor(props) {
        super(props)
        // this.getSeverities = this.getSeverities.bind(this)
        this.createTask = this.createTask.bind(this)
        this.state = {
            title: null,
            problem: null,
            type: null,
            severityId: null,
            assignedToId: null,
            assignedToType: null,
            estimatedDurationMinutes: null,
            expectedBeginning: null,
            predefinedTimeId: null,
            createdById: null,
            active: null,
            hasActiveInstance: null,
            elementId: null,
            severity: null
        }
    }
    componentDidMount() {
        api.getSeverity(this.state)
        .then(function(response) {
            let reversed = response.reverse()
            let severity = new Object()
            reversed.map(function(array) {
                return severity[array.value] = array.id
            })
        // this.setState({severity: severity})  
        // }.bind(this))
    })
}

    
    dropDown(event) {
        var selected = document.getElementById([event.target.id]).value;
        this.setState({[event.target.name]: selected})
        console.log(selected)
    }
    handleChange(event) {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value})
    }
    createTask() {
        return axios({
            method: 'post',
            url: instance.baseURL+"/TaskCatalogs?access_token="+_token,
            headers: {'X-Custom-Header': 'foobar'},
            data: { 
                    "title": this.state.title,
                    "problem": this.state.problem,
                    "type": this.state.type,
                    "severityId": this.state.severityId,
                    "assignedToId": this.state.assignedToId,
                    "assignedToType": this.state.assignedToType,
                    "estimatedDurationMinutes": this.state.estimatedDurationMinutes,
                    "predefinedTimeId": this.state.predefinedTimeId,
                    "active": this.state.active,
                    "hasActiveInstance": this.state.hasActiveInstance,
                    "elementId": this.state.elementId
             },
        })
        .then(function(response) {
            console.log(response)
        })
        .catch(function(error) {
            console.log(error)
        })
    }
    render() {
        return (<div>
        <form>
        <input name="title" placeholder="title" type="text" onChange={event => this.handleChange(event)}/>
        <input name="problem" placeholder="problem" type="text" onChange={event => this.handleChange(event)}/>
        {/* <input name="type" placeholder="type" type="text" onChange={event => this.handleChange(event)}/> */}
        <select id="type-dropdown" name="type" onChange={event => this.dropDown(event)}>
            <option>Type of task</option>
            <option value="Evolutionary">Evolutionary</option>
            <option value="Preventive">Preventive</option>
            <option value="Corrective">Corrective</option>
        </select>
        <input name="severityId" placeholder="severityId" type="text" onChange={event => this.handleChange(event)}/>
        <input name="assignedToId" placeholder="assignedToId" type="text" onChange={event => this.handleChange(event)}/>
        <select id="asigned-type-dropdown" name="assignedToType" onChange={event => this.dropDown(event)}>
            <option>Assign to...</option>
            <option value="Profile">Profile</option>
            <option value="Team">Team</option>
        </select>
        <input name="estimatedDurationMinutes" type="number" placeholder="estimatedDurationMinutes" onChange={event => this.handleChange(event)}/>
        <input name="predefinedTimeId" type="text" placeholder="predefinedTimeId" onChange={event => this.handleChange(event)}/>
        <select id="active-dropdown" name="active" onChange={event => this.dropDown(event)}>
            <option>Active?</option>
            <option value="True">True</option>
            <option value="False">False</option>
        </select>
        <select id="active-instance-dropdown" name="hasActiveInstance" onChange={event => this.dropDown(event)}>
            <option>Active instance?</option>
            <option value="True">True</option>
            <option value="False">False</option>
        </select>
        <input name="elementId" placeholder="elementId" onChange={event => this.handleChange(event)}/>
        <button type="button" onClick={this.createTask}>
            Create Task!
        </button>
        </form>
</div>)



    }
}
export default TaskDemo