import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { username, password } from './loginAction'

const LoginForm = props => (
    <form className="m-t" role="form" action="" onSubmit={value => props.onSubmitLogin}>
        <div className="form-group">
            <input type="username" name="username" className="form-control" required="yes" onChange={props.username}  value ={props.value}/>
        </div>
        <div className="form-group">
            <input type="password" name="password" className="form-control" required="yes" onChange={props.password}  value ={props.value}/>
        </div>
        <button type="submit" className="btn btn-primary block full-width m-b">Login</button>
    </form>
)


const mapStateToProps = (state) => {
    return {
        username: state.login.username,
        password: state.login.password
    }
}

const mapDispatchToProps= (dispatch) => {
    return bindActionCreators({ username, password }, dispatch)
}

export default connect (mapStateToProps, mapDispatchToProps)(LoginForm)