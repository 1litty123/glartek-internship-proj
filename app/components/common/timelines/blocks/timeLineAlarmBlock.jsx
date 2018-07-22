import React from 'react'
import { Link } from 'react-router'


export default (props) => (
    <div className="vertical-timeline-block">
        <div className={"vertical-timeline-icon " + props.iconColor}>
            <i className={"fa fa-" + props.icon}></i>
        </div>

        <div className="vertical-timeline-content">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <button className="btn btn-sm btn-default" to={props.path}>Create Task</button>
            <button className="btn btn-sm btn-warning" to={props.path}>Ack</button>
            <small>{props.date}</small>
        </div>
    </div>
)