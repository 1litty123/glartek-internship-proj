import React, { Component } from 'react';
import ColorWidget from '../common/widgets/colorWidget'
import ChartWidget from '../common/widgets/chartWidget'

class Minor extends Component {

    render() {
        return (
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="text-center m-t-lg">
                            <ColorWidget color="red-bg" icon="warning" title="Alarms" value="12" subtitle="dsfg" />
                            <ChartWidget title="Test" value="15" data={[5,8,1,12,15,7]} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Minor