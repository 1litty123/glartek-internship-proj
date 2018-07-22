import React from 'react'
import Consts from '../../../../utils/consts'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { subTopic, unsubTopic } from '../../../../utils/mqttSubscriptions'

import ColorWidget from '../../../common/widgets/colorWidget'
import ChartWidget from '../../../common/widgets/chartWidget'


class Synotic extends React.Component {

  render() {
    return (
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-lg-3">
            <div className="text-center m-t-lg">
              <ColorWidget color='lazur-bg' icon='tasks' title='TASKS' value='3' subtitle='' />
            </div>
          </div>
          <div className="col-lg-3">
            <div className="text-center m-t-lg">
              <ChartWidget title='Test Topic 1'  topic='topic/equipment1/random/cena2' data={[]} />
            </div>
            <div className="text-center m-t-lg">
              <ChartWidget title='Test Topic 2'  topic='topic/equipment1/random/cena1' data={[]} />
            </div>
            <div className="text-center m-t-lg">
              <ChartWidget title='Test Topic 3'  topic='topic/equipment1/random/cena3' data={[]} />
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default Synotic