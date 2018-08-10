import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { connection, onTopicMsg } from '../utils/mqtt'

import jquery from 'jquery';
import metismenu from 'metismenu';
import bootstrap from 'bootstrap';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../node_modules/font-awesome/css/font-awesome.css'
import '../../node_modules/animate.css/animate.min.css'
import '../../public/styles/style.css'

import Main from '../components/layouts/Main'
import Login from '../components/login/Login'
import { validateToken } from '../components/login/loginAction'


class LoginOrApp extends React.Component {

    componentWillMount() {

        // Declare event that receive mqtt msg
        this.props.onTopicMsg()
        // Declare stream of alarms


        // Detect if is login or the app
        if (this.props.auth.user) {
            console.log(this.props.auth.user, 1)
            this.props.validateToken(this.props.auth.user)
        } else {
            this.props.validateToken(localStorage.getItem('_user'))
            console.log(localStorage.getItem('_user'), 2)
        }
    }

    componentWillUnmount() {
        // Close mqtt connection
        connection.end()
    }

    render() {

        const { user, validToken } = this.props.auth
        //console.log(this.props.auth)
        if (user && validToken) {
            axios.defaults.headers.common['authorization'] = user.id
            //console.log(this.props.children)
            return <Main>{this.props.children}</Main>
        }
        else if (!user && !validToken) {
            return <Login />
        } else {
            return false
        }
    }
}

const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators({ validateToken, onTopicMsg }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(LoginOrApp)