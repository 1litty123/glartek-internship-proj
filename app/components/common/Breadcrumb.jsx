import React from 'react'
import { Link } from 'react-router'

class Breadcrumb extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const renderPath = () => {
            const data = this.props.path || []

            return data.map((value, index) => {
                if (index < data.length - 1) {
                    return (
                        <li key={index} >
                            <Link to={data.slice(0, index + 1).join("/")}>{value}</Link>
                        </li>
                    )
                } else {
                    return (
                        <li className="active" key={index}>
                            <strong>{value}</strong>
                        </li>
                    )
                }
            })
        }
        return (
            <div className="row wrapper border-bottom white-bg page-heading">
                <div className="col-lg-10">
                    <h2>{this.props.title.toUpperCase()}</h2>
                    <ol className="breadcrumb">
                        {renderPath()}
                    </ol>
                </div>
                <div className="col-lg-2">

                </div>
            </div>
        )
    }
}

export default Breadcrumb

