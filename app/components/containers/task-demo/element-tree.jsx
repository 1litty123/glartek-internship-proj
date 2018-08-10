import React from 'react'
import api from '../../../utils/api'


class ElementTree extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            siteNames: null,
            siteIds: null,
            siteLength: null
        }
    }
    getSites() {
        api.getSites(this.state)
        .then(function(response) {
            let siteNames = []
            let siteIds = []
            response.map(function(array) {
                siteNames.push(array.name)
                siteIds.push(array.id)
            })
            let siteLength = siteNames.length
            this.setState(function() {
                return {
                    siteNames: siteNames,
                    siteIds: siteIds,
                    siteLength: siteLength
                }
            })
        }.bind(this))
    }
    getElementFromSite() {
        return axios({
            method: 'get',
            url: instance.baseURL+"/CompanySites/"+this.state.elementId+"/element?access_token="+_token
        })
        .then(function(response) {
            
        
        })
    }
    render() {
        let siteOptions = []
        for (let i = 0; i < this.state.siteLength; i++) {
            siteOptions.push(<option value = {this.state.siteIds[i]}>{this.state.siteNames[i]}</option>)
        }
    return (<select id="site-option-dropdown" name="">

    </select>)

    }
}