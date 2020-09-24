import React, { Component } from 'react';
import Link from "next/link";

import axios from "axios";

class TestEndpoint extends Component {
    constructor(props) {
        super(props);

        this.state = {result: "Waiting..."};
    }

    componentDidMount() {
        axios.get(process.env.FOOD_TRUCK_API_URL + "/uptime")
        .then( (res) => {
            this.setState({result: res.data});
        })
        .catch((err) => {
            this.setState({result: err.response});
        });
    }
    
    render() {
        return (
            <div>
                <h1>Test Endpoint</h1>
                <h2>Uptime: {this.state.result} seconds</h2>
            </div>
        );
    }
}
export default TestEndpoint;