import React, { Component } from 'react';
import api from '../../utils/api';


class Compressor01 extends Component {

    constructor() {
        super();
        this.state = {
            repo: null
        };
    }
    
    componentDidMount (){
        api.fetchAssetList(this.state)
            .then(function(response){
                this.setState(function(){
                    return {
                        repo: response
                    }
                    return console.log(repo)
                })
            }.bind(this));
    }

    render() {
            return (
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center m-t-lg">
                                <h1>
                                    Compressor01                                    
                                </h1>
                                <small>
                                    É do caralho
                                </small>

                                {!this.state.repo
                                ? <p>LOADING</p>
                                : <div> {this.state.repo[0].description} </div>}
                                
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
}

export default Compressor01