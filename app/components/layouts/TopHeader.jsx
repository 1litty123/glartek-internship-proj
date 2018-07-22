import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logout } from '../login/loginAction'
//import { Dropdown } from 'react-bootstrap';
import { smoothlyMenu } from '../layouts/Helpers';

class TopHeader extends React.Component {

    constructor(props){
        super (props)

    }

    toggleNavigation(e) {
        e.preventDefault();
        $("body").toggleClass("mini-navbar");
        smoothlyMenu();
    }

    clickLogout(){
        const user = JSON.parse(localStorage.getItem('_user')) 
        console.log(user.id)
        logout(user.id)
    }

    render() {
        //const { user } = this.props.auth
        return (
            <div className="row border-bottom">
                <nav className="navbar navbar-static-top" role="navigation" style={{marginBottom: 0}}>
                    <div className="navbar-header">
                        <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.toggleNavigation} href="#"><i className="fa fa-bars"></i> </a>
                    </div>
                    <ul className="nav navbar-top-links navbar-right">
                        <li>
                            <a onClick={this.clickLogout} >
                                <i className="fa fa-sign-out"></i> Log out
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators ({ logout }, dispatch)

export default connect(null, mapDispatchToProps)(TopHeader)