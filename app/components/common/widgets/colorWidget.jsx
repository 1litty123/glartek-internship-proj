import React from 'react'


export default (props) => (
    <div className={"widget " + props.color + " p-lg text-center"} >
        <div className="m-b-md">
            <i className={"fa-4x fa fa-" + props.icon} ></i>
            <h1 className="m-xs">{props.value}</h1>
            <h3 className="font-bold no-margins">
                {props.title}
            </h3>
            <small>{props.subtitle}</small>
        </div>
    </div>
)