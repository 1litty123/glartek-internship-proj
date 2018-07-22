import React from 'react';
//import { Dropdown } from 'react-bootstrap';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { login } from './loginAction'
import { correctHeight, detectBody } from '../layouts/Helpers';
import input from '../common/form/input'


class Login extends React.Component {


    collapsePanel(e) {
        e.preventDefault();
        var element = $(e.target);
        var ibox = element.closest('div.ibox');
        var button = element.closest("i");
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    }

    closePanel(e) {
        e.preventDefault();
        var element = $(e.target);
        var content = element.closest('div.ibox');
        content.remove();
    }

    componentDidMount() {
        // Run correctHeight function on load and resize window event
        $(window).bind("load resize", function () {
            correctHeight();
            detectBody();
        });

        // Correct height of wrapper after metisMenu animation.
        $('.metismenu a').click(() => {
            setTimeout(() => {
                correctHeight();
            }, 300)
        });
    }

    onSubmit(values){
        const { login } = this.props
        console.log(values)
        login(values)
    }

    render() {
        //let wrapperClass = "gray-bg " + this.props.location.pathname;
        const { handleSubmit } = this.props
        return (
            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>
                    <div>
                        <h1 className="logo-name">GL+</h1>
                    </div>
                    <h3>Welcome to Glarboard</h3>

                    <p>Login in. To see it in action.</p>
                    <form className="m-t" role="form" onSubmit={handleSubmit(v => this.onSubmit(v))}>
                        <Field name="username" component={input} 
                        required="true"
                        placeholder="username" type="text" />
                        <Field name="password" component={input} 
                        required="true"
                        placeholder="password" type="password" />
                        <button type="submit" className="btn btn-primary block full-width m-b">Login</button>
                    </form>
                    <p className="m-t"> <small>Developed by Glartek &copy; 2017</small> </p>
                </div>
            </div>
        )
    }
}

Login = reduxForm({ form: 'loginForm' })(Login)
const mapDispatchToProps = dispatch => bindActionCreators({ login }, dispatch)

export default connect(null, mapDispatchToProps)(Login)
