import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ColorWidget from '../../common/widgets/colorWidget'
import ProfileWidget from '../../common/widgets/profileWidget'
import TimeLineAlarm from '../../common/timelines/timeLineAlarm'
import TimeLineTask from '../../common/timelines/timeLineTask'


class Profile extends React.Component {

  render() {
    const user = this.props.userProfile || null
    return (
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <ProfileWidget id={!user ? null : user.id} image={!user ? null : user.photography} name={!user ? 'LOADING' : user.name} email={!user ? 'LOADING' : user.email} description={!user ? 'LOADING' : user.summary} />
          <div className="col-lg-3">
            <div className="text-center m-t-lg">
              <ColorWidget color='lazur-bg' icon='tasks' title='TASKS' value='3' subtitle='' />
            </div>
          </div>
          <div className="col-lg-3">
            <div className="text-center m-t-lg">
              <ColorWidget color='red-bg' icon='exclamation-triangle' title='ALARMS' value={this.props.alarms.filter(t => t.status == 'active').length} subtitle='' />
            </div>
          </div>
          <div className="col-lg-6 m-b-lg">
            <h1>TASKS</h1>
            <TimeLineTask />
          </div>
          <div className="col-lg-6 m-b-lg">
            <h1>ALARMS</h1>
            <TimeLineAlarm alarmQuery="/Alarms?filter[include][alarmlist]" />
          </div>

        </div>
      </div >
    )
  }
}
// Passa o objecto de State para as propriedades do componente 'props'
const mapStateToProps = state => ({
  userProfile: state.profile.profile,
  alarms: state.alarms.alarms
})

export default connect(mapStateToProps, null)(Profile)