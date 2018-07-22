import React from 'react'


export default (props) => (
    <div className="vertical-timeline-block">
        <div className={"vertical-timeline-icon " + props.iconColor}>
            <i className={"fa fa-" + props.icon}></i>
        </div>
        <div className="vertical-timeline-content">
            <span className="label pull-right label-warning">{props.state}</span>
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <button className="btn btn-sm btn-primary" to={props.path}>Start Task</button>
            <button className="btn btn-sm btn-default" to={props.path}>More Info</button>
            <small>{props.date}</small>
        </div>
    </div>
)