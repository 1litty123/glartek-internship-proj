import React from 'react';
import ReactTable from 'react-table'
import axios from 'axios'

import Consts from '../../../utils/consts'
import 'react-table/react-table.css'


class Alarms extends React.Component {

// definir estrutura json da query dentro da variavel de estado
constructor () {
    super();

    this.state = {
        alarmsData: [{
            status: "",
            begin_date: "",
            ack_date: "",
            id: "",
            areaId: "",
            systemId: "",
            assetId: "",
            subAssetId: "",
            alarmId: "",
            alarmlist: {
                name: "",
                description: "",
                severity: "",
                id: "",
                areaId: "",
                systemId: "",
                assetId: "",
                subAssetId: ""
            }
        }]
    }
}

// Faz o pedido à rest e faz o setState à variavel de estado
componentDidMount (){
    axios.get(Consts.API_URL+"/Alarms?filter[include][alarmlist]&filter[where][status]=active")
    .then(function(response){
        this.setState({alarmsData:response.data}) ;
    }.bind(this))
}


render (){

    // Define o objecto a ser renderizado na tabela
    const {alarmsData} = this.state;
    //console.log (alarmsData)

    // Define estrutura das colunas da tabela
    const columns = [{
        Header: 'Name',
        accessor: 'alarmlist.name' // Custom value accessors!
      }, {
        Header: 'Begin Date',
        accessor: 'begin_date'
      },{
        Header: 'End Date',
        accessor: 'end_date'
      },{
        Header: 'Ack Date',
        accessor: 'ack_date'
      }, {
        Header: 'Status',
        accessor: 'status'
      }]

return (
 
<div className="wrapper wrapper-content animated fadeInRight">
    <div className="row">
        <div className="col-lg-12">

            <ReactTable
                data={alarmsData}
                columns={columns}
                loading={false} />

        </div>
    </div>
</div>
)}

}   

export default Alarms