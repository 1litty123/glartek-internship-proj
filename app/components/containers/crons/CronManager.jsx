import React from 'react';
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/fontawesome-free-solid'
import { translate } from 'react-i18next'
import NewCron from './fragments/newCronFrag'
import LoadCron from './fragments/loadCronFrag'



class CronManager extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            collapsed: false
        }
    }

    handleCollapse = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    update = () => {
        //if open, then open and close
        if (this.state.collapsed) {
            this.handleCollapse()
            this.handleCollapse()
        }
        this.forceUpdate()
    }

    render() {
        const { t } = this.props;
        const css = {
            label: {
                fontSize: 24,
                fontWeight: 100,
                width: 225,
                cursor: 'pointer'
            }
        }

        return (
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ibox float-e-margins">
                            <div className="ibox-content">
                                <form className="form-horizontal">
                                    <NewCron callback={() => this.update()} />
                                </form>
                                <hr />
                                <div onClick={this.handleCollapse} style={{ cursor: 'pointer' }}>
                                    <label style={css.label}>{t("labels.avaliableCrons")}</label>
                                    <FontAwesomeIcon style={{ height: 20 }} icon={this.state.collapsed ? faChevronUp : faChevronDown} color="rgba(0,0,0,0.5)" />
                                </div>
                                {this.state.collapsed ?
                                    <LoadCron management={true} callback={() => null} />
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default compose(translate('cronManager'), connect(mapStateToProps, mapDispatchToProps))(CronManager)
