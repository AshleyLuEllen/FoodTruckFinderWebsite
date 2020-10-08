import React, { Component } from 'react';
import Link from "next/link";
import Settings from "./settings";

class Dashboard extends Component {
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
                <h2>Dashboard</h2>
                <body>This is the Dashboard. I'm not sure what's supposed to be here, but once I figure it out, I'll put it here.</body>
                <body> </body>
                <body>-Joel Futagawa</body>
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
export default Dashboard;

