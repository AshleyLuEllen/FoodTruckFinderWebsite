import React, { Component } from 'react';
import Link from "next/link";

class Login extends Component {
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
                <h2>Login</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>
                            Email:
                        </label>
                        <input email = "email" type="text" onChange={this.handleInputChange} />
                    </div>

                    <div>
                        <label>
                            Password:
                        </label>
                        <input password = "password" type="text" onChange={this.handleInputChange} />
                    </div>
                    <input type="submit" value="Submit" />
                </form>
                <br />
                <label>{this.state.message}</label>
                <li>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
            </div>
        );
    }
}
export default Login;