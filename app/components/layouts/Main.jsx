import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getProfile } from './layoutActions'

// Layout elements
import Progress from './Progress'
import Navigation from './Navigation'
import Footer from './Footer'
import TopHeader from './TopHeader'
import Breadcrumb from '../common/Breadcrumb'
import { correctHeight, detectBody } from './Helpers'


class Main extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let wrapperClass = "gray-bg " + this.props.children.props.location.pathname
        const title = this.props.children.props.route.title

        return (

            <div id="wrapper">
                <Progress />
                <Navigation location={this.props.children.props.location.pathname} />
                <div id="page-wrapper" className={wrapperClass}>
                    <TopHeader />
                    <Breadcrumb title={title} path={this.props.children.props.location.pathname.split('/')} />
                    {this.props.children}
                    <Footer />
                </div>
            </div>

        )
    }

    componentDidMount() {

        if (!sessionStorage.getItem('_profile')) {
            const user = JSON.parse(localStorage.getItem('_user'))
            this.props.getProfile(`/Profiles/${user.userId}`)

        }
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
}

// Passa o objecto de State para as propriedades do componente 'props'
function mapStateToProps(state) {
    return {
        userProfile: state.profile.profile
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getProfile }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)