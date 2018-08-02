import React from 'react'

import consts from '../../../utils/consts'


export default (props) => (
    <div className="col-md-6">
        <div className="text-left m-t-lg">
            <div className="profile-image">
               
            </div>
            <div className="profile-info">
                <div>
                    <h2 className="no-margins">
                        {props.name}
                    </h2>
                    <h4>{props.email}</h4>
                    <small>
                        {props.description}
                    </small>
                </div>
            </div>
        </div>
    </div>
)