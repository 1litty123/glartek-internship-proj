import React from 'react'

import consts from '../../../utils/consts'


export default (props) => (
    <div className="col-md-6">
        <div className="text-left m-t-lg">
            <div className="profile-image">
                {!props.image
                    ? <i className="fa-4x fa fa-user-circle" />
                    : <img className="img-circle circle-border m-b-md" src={consts.API_URL+"/Storages/"+ props.id +"/download/"+ props.image} alt="profile" height="96" width="96" alt="profile" />}

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