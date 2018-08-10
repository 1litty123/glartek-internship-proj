import React from 'react'
import api from '../../../utils/api'
import axios from 'axios'
import Date from './date-picker'
import Example from './tree-demo'

var instance = {
    baseURL: 'http://192.168.65.50:3000/api',
}

const _token = JSON.parse(localStorage.getItem('_user')).id

class TaskDemo extends React.Component {
    constructor(props) {
        super(props)        
        this.createTask = this.createTask.bind(this)
        this.getSeverities = this.getSeverities.bind(this)
        this.getTeamId = this.getTeamId.bind(this)
        this.createDropdown = this.createDropdown.bind(this)
        this.getPredefinedTimeId = this.getPredefinedTimeId.bind(this)
        this.getElements = this.getElements.bind(this)
        this.state = {
            title: null,
            problem: null,
            type: null,
            severityId: null,
            assignedToId: null,
            assignedToType: "Team",
            expectedBeginning: null,
            estimatedDurationMinutes: null,
            expectedBeginning: null,
            predefinedTimeId: null,
            createdById: null,
            active: null,
            hasActiveInstance: null,
            elementId: null,
            severity: null,
            teamName: null,
            teamId: null,
            teamLength: null
        }
    }
    componentDidMount() {
        this.getSeverities();
        this.getTeamId();
        this.getElements();
    }
    getTeamId() {
        api.getTeamId(this.state)
        .then(function(response) {
            let teamName = []
            let teamId = []
            response.forEach(function(array) {
                teamName.push(array.name)
                teamId.push(array.id)
            })
            let teamLength = teamName.length
            console.log(teamLength)
            this.setState(function() {
                return {
                    teamName: teamName,
                    teamId: teamId,
                    teamLength: teamLength
                }
            })
        // let options = []
        // for (let i = 0; i < this.state.profileUsername.length; i ++) {
        //     options.push(<option>{i}</option>)
        // }
        // return options
        }.bind(this)) 
    }
    createDropdown() {
    let options = []
        for (let i = 0; i < 5; i ++) {
            options.push(<option>{i}</option>)
        }
        return options
    }
    getElements() {
        api.getElements(this.state)
        .then(function(response) {
            let element_name = [] 
            let element_id = []
            response.map(function(element) {
                element_name.push(element.name)
                element_id.push(element.id)
            })
            let element_length = element_name.length
            this.setState(function() {
                return {
                    elementNames: element_name,
                    elementId: element_id,
                    elementLength: element_length
                }
            })
        }.bind(this))
    }
    getSeverities() {
        api.getSeverity(this.state)
        .then(function(response) {
            let reversed = response.reverse()
            let severity = new Object()
            reversed.map(function(array) {
                severity[array.value] = array.id
            })
            this.setState(function() {
                return {
                    severity: severity
                }
            })
            
        }.bind(this))
    }
    dropDown(event) {
        let selected = document.getElementById([event.target.id]).value;
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
                    "expectedBeginning": this.state.expectedBeginning,
                    "estimatedDurationMinutes": this.state.estimatedDurationMinutes,
                    "predefinedTimeId": this.state.predefinedTimeId,
                    // "active": this.state.active,
                    // "hasActiveInstance": this.state.hasActiveInstance,
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
    getPredefinedTimeId(id) {
        this.setState({predefinedTimeId: id})
        console.log(this.state.predefinedTimeId)
    }
    render() {
        if (this.state.severity == null && !this.state.elementNames) {
            return <div>loading...</div>
        }
        let teamOptions = []
        for (let i = 0; i < this.state.teamLength; i++) {
            teamOptions.push(<option value={this.state.teamId[i]}>{this.state.teamName[i]}</option>)
        }
        let elementOptions = []
        for (let i = 0; i < this.state.elementLength; i++) {
            elementOptions.push(<option value={this.state.elementId[i]}>{this.state.elementNames[i]}</option>)
        }
               return (<div>
        <form>
        <input name="title" placeholder="title" type="text" onChange={event => this.handleChange(event)}/>
        <input name="problem" placeholder="problem" type="text" onChange={event => this.handleChange(event)}/>
        <select id="type-dropdown" name="type" onChange={event => this.dropDown(event)}>
            <option>Type of task</option>
            <option value="Evolutionary">Evolutionary</option>
            <option value="Preventive">Preventive</option>
            <option value="Corrective">Corrective</option>
        </select>
        <select id="severity-id-dropdown" name="severityId" onChange={event => this.dropDown(event)}>
            <option>Severity Value</option>
            <option value={this.state.severity[0]}>Very Low</option>
            <option value={this.state.severity[1]}>Low</option>
            <option value={this.state.severity[2]}>Medium</option>
            <option value={this.state.severity[3]}>High</option>
            <option value={this.state.severity[4]}>Very High</option>
        </select>
        <select id="assigned-id-dropdown" name="assignedToId" onChange={event => this.handleChange(event)}>
            <option>Assign to...</option>
            {teamOptions}
        </select>
        <select id="assigned-element-id-dropdown" name="elementId" onChange={event => this.handleChange(event)}>
            <option>Assign element...</option>
            {elementOptions}
        </select>
        <input name="estimatedBeginning" type="number" placeholder="estimatedBeginning" onChange={event => this.handleChange(event)}/>
        <input name="estimatedDurationMinutes" type="number" placeholder="estimatedDurationMinutes" onChange={event => this.handleChange(event)}/>
        {/* <select id="active-dropdown" name="active" onChange={event => this.dropDown(event)}>
            <option>Active?</option>
            <option value="True">True</option>
            <option value="False">False</option>
        </select> */}
        {/* <select id="active-instance-dropdown" name="hasActiveInstance" onChange={event => this.dropDown(event)}>
            <option>Active instance?</option>
            <option value="True">True</option>
            <option value="False">False</option>
        </select> */}
        <Date predefinedTimeId={this.getPredefinedTimeId}/>
        <button type="button" onClick={this.createTask}>
            Create Task!
        </button>
        </form>
        <Example/>
</div>)
    }
}

export default TaskDemo