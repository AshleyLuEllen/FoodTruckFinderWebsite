import React, { Component } from 'react';
import Link from "next/link";

class Notifications extends Component {
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
    }
    componentDidMount() {
    }
    render() {
        return (
            <div>
                <h2>Notifications</h2>
                <li>
                    <Link href="/[truck_id]">
                        <a>Trucks!</a>
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
export default Notifications;