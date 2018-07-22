import React from 'react'
import {Link} from 'react-router'

export default props => (
    <li>
        <Link to={props.path}>
            <i className={'fa fa-'+props.icon}></i> 
            <span className='nav-label'>{props.label}</span> 
            <span className='fa arrow'></span>
        </Link>
            <ul className={'nav nav-'+props.level+'-level'}>
                {props.children}
            </ul>
    </li>    
)