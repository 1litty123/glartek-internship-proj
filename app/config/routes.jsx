import React from 'react'
import { Route, Router, IndexRedirect, hashHistory } from 'react-router';

import LoginOrApp from '../main/loginOrApp'
//import Main from '../components/layouts/Main';
import NotFound from '../components/common/NotFound';

import Profile from '../components/containers/profile/Profile'
import Alarms from '../components/containers/alarms/Alarms'
import AlarmHistory from '../components/containers/alarms/AlarmHistory'
import CentralRefrigSynotic from '../components/containers/dashboards/centralRefrig/Synotic'
import main from '../components/containers/Main'
import MinorView from '../components/containers/Minor'

export default () => (

    <Router history={hashHistory}>
        <Route path="/" component={LoginOrApp} >
            <IndexRedirect to="profile" />
            <Route path="profile" title="PROFILE" component={Profile}/> 
            <Route path="minor" title="Test View" component={MinorView}/> 
            <Route path="main" title="Test View" component={main}/> 
            <Route path="alarms" title="alarms" component={Alarms}/> 
            <Route path="alarmsHistory" title="alarms History" component={AlarmHistory}/> 
            <Route path="dashboards/centralRefrig/synotic" title="Central de Refrigeração" component={CentralRefrigSynotic} />
            <Route path="*" title="Not Found" component={NotFound} />
        </Route>
    </Router>

)