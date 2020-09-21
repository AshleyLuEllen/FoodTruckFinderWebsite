import React, { Component } from 'react';
import Link from "next/link";

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeStatus(event) {
        this.setState({level: event.target.value});
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleSubmit(event) {
        this.props.history.push('/')
    }
    componentDidMount() {
    }
    render() {
        return (
            <div>
                <h2>Map</h2>
                <li>
                    <Link href="/search">
                        <a>Search</a>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
            </div>
        );
    }
}
export default Map;