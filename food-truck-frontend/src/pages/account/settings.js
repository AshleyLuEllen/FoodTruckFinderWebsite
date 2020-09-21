import React, { Component } from 'react';
import Link from "next/link";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeStatus(event) {
    }
    handleInputChange(event) {
    }
    handleSubmit(event) {
        this.props.history.push('/')
    }
    componentDidMount() {
    }
    render() {
        return (
            <div>
                <h2>Settings</h2>
                <li>
                    <Link href="/account">
                        <a>Account</a>
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
export default Settings;