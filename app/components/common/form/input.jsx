import React from 'react'

export default props => (
    <div className="form-group">
        <input {...props.input} className="form-control" required={props.required} placeholder={props.placeholder} type={props.type}  />
    </div>
)