import React, { Component } from 'react';
import Link from "next/link";

import axios from "axios";

class TestEndpoint extends Component {
    constructor(props) {
        super(props);

        this.state = {result: "Waiting..."};
    }

    componentDidMount() {
        axios.get(process.env.FOOD_TRUCK_API_URL + "/ping")
        .then( (res) => {
            this.setState({result: res});
        })
        .catch((err) => {
            this.setState({result: err.response});
        });
    }
    render() {
        return (
            <div>
                <h1>Test Endpoint</h1>
                <h2>{this.state.result}</h2>
            </div>
        );
    }
}
export default TestEndpoint;