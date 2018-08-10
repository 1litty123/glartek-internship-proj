import React from 'react';
import ReactDOM from 'react-dom';
import SuperTreeview from 'react-super-treeview';
import '../../../../node_modules/react-super-treeview/dist/style.css';
import cloneDeep from 'clone-deep'
import api from '../../../utils/api'
import axios from 'axios'

class Example extends React.Component {
    constructor(props){
        super(props);
        this.getSites = this.getSites.bind(this)
        // SET YOUR DATA
        this.state = 
        { data: [
            {
                id: 1,
            name: 'Parent A'
            }
        ]
        }
    }
    componentDidMount() {
        this.getSites()
    }
    getSites() {
        api.getSites(this.state)
        .then(function(response) {
            let newArray = []
            response.map(function(site) {
                newArray.push(this.state.data.concat(
                    {
                        id: site.id,
                        name: site.name
                    }
                ))
            })
            this.setState({data: newArray})
        })
    }
    render(){
        console.log(this.state.data)
        return (
            // RENDER THE COMPONENT
            <SuperTreeview
                data={ this.state.data }
                onUpdateCb={(updatedData)=>{
                    this.setState({data: updatedData});
                }}
                isCheckable={()=>(false)}
                isDeletable={()=>(false)}
                isExpandable={(node, depth)=>{ return (depth===0)? true : false; }}
                onExpandToggleCb={(node, depth)=>{
                    if(node.isExpanded === true){
                        // This will show the loading sign
                        node.isChildrenLoading = true;
            
                        setTimeout(()=>{
                            const updatedData = cloneDeep(this.state.data);
            
                            // Remove loading sign
                            updatedData[0].isChildrenLoading = false;
            
                            // Make sure node is expanded
                            updatedData[0].isExpanded = true;
            
                            // Set Children data that you potentially
                            // got from an API response
                            updatedData[0].children = [
                                {
                                    id: 22,
                                    name: 'Child 1'
                                },
                                {
                                    id: 23,
                                    name: 'Child 2'
                                }
                            ];
            
                            // Update state
                            this.setState({data: updatedData})
            
                        }, 1700);
                    }
                }}
            />
        );
    }
}

export default Example