import React, { Component } from 'react'
import { connect } from 'react-redux'

import consts from '../../utils/consts'
//import { Dropdown } from 'react-bootstrap'
//import { Link, Location } from 'react-router'
import MenuButton from '../common/menu/menuButton'
import MenuTree from '../common/menu/menuTree'
import MenuItem from '../common/menu/menuItem'

class Navigation extends Component {

    componentDidMount() {
        const { menu } = this.refs;
        $(menu).metisMenu();
    }

    render() {
        const user = this.props.userProfile || null
        return (
            <nav className='navbar-default navbar-static-side' role='navigation'>
                <ul className='nav metismenu' id='side-menu' ref='menu'>
                    <li className='nav-header'>
                        <div className='dropdown profile-element'>
                            
                            <a data-toggle='dropdown' className='dropdown-toggle' href='#'>
                                <span className='clear'> <span className='block m-t-xs'> <strong className='font-bold'>{!user ? 'LOADING' : user.name}</strong>
                                </span> <span className='text-muted text-xs block'>{!user ? 'LOADING' : user.email}<b className='caret'></b></span> </span> </a>
                            <ul className='dropdown-menu animated fadeInRight m-t-xs'>
                                <li><a href='#'> Logout</a></li>
                            </ul>
                        </div>
                        <div className='logo-element'>
                            GL+
                            </div>

                    </li>
                    <MenuButton path='/profile' label='Profile' icon='user-secret' />
                    <MenuTree path='/dashboards' label='Dashboards' icon='tachometer' level='second'>
                        <MenuTree path='/dashboards' label='Central Refrigeração' level='third' >
                            <MenuItem path='/dashboards/centralRefrig/synotic' label='Synotic' />
                            <MenuItem path='/dashboards/centralRefrig/charts' label='Charts' />
                            <MenuItem path='/dashboards/centralRefrig/parameters' label='Parameters' />
                        </MenuTree>
                    </MenuTree>
                    <MenuTree path='/alarms' label='Alarmistic' icon='exclamation-triangle' level='second' >
                        <MenuItem path='/alarms' label='Alarms' />
                        <MenuItem path='/alarmsHistory' label='Alarms History' />
                        <MenuItem path='/alarmManager' label='Alarm Manager' />
                    </MenuTree>
                    <MenuTree path='/checkLists' label='Check Lists' icon='check-circle' level='second' >
                        <MenuItem path='/checkLists' label='Check List' />
                        <MenuItem path='/checkListHistory' label='Check List History' />
                        <MenuItem path='/checkListManager' label='Check List Manager' />
                    </MenuTree>
                    <MenuButton path='/userManager' label='User Manager' icon='users' />
                    <MenuTree path='/task' label='Task Manager' icon='tasks' level='second'>
                        <MenuItem path='/myTasks' label='My Tasks' />
                        <MenuItem path='/createTask' label='Create' />
                        <MenuItem path='/tasksHistory' label='Tasks History' />
                    </MenuTree>
                    <MenuTree path='/plant' label='Plant Manager' icon='cog' level='second'>
                        <MenuItem path='/profile' label='Profile' />
                        <MenuItem path='/profileEditor' label='Editor' />
                        <MenuItem path='/team' label='Team' />
                    </MenuTree>
                </ul>

            </nav>
        )
    }
}

// Passa o objecto de State para as propriedades do componente 'props'
function mapStateToProps(state) {return {userProfile: state.profile.profile}}

export default connect(mapStateToProps, null) (Navigation)