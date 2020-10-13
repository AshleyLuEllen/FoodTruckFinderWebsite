import React, { Component } from 'react';
import Link from "next/link";
import { withRouter } from 'next/router';


class Manage extends Component {
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
                <h2>Manage</h2>
                <li>
                    <Link href={`/${this.props.router.query.truck_id}`}>
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
export default withRouter(Manage);