import React, { Component } from 'react';
import {applyMiddleware, createStore} from 'redux';
import axios from 'axios';
import logger from 'redux-logger';
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

const initialState = {
    fetching: false,
    fetched: false,
    asset: [],
    error: null,
};

const reducer = (state=initialState, action) => {
    switch (action.type){
        case "FETCH_ASSETS_PENDING": {
            return {...state, fetching: false}
            break;
        }
        case "FETCH_ASSETS_REJECTED": {
            return {...state, fetching: false, error: action.payload}
            break;
        }
        case "RECEIVE_ASSETS_FULFILLED": {
            return {...state, fetching: false, fetched: true ,asset: action.payload}
            break;
        }
    }
    return state
}

const middleware = applyMiddleware(promise() ,thunk,logger);

const store = createStore(reducer, middleware);

/*
store.dispatch({
    type: "FETCH_ASSETS",
    payload: axios.get("http://192.168.65.50:3000/api/EquipmentsList")
    })*/

class Compressor02 extends Component {

    render() {

            return (
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center m-t-lg">
                                <h1>
                                    Compressor02                                 
                                </h1>
                                <small>
                                    É........
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            )

    }
}

export default Compressor02