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
    createAccount() {
        console.log("create account!");
    }
    render() {
        return (
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={this.handleSubmit}>
                    <table className="login-form-details">
                        <tbody>
                            <tr>
                                <td>
                                    <label for="email">
                                        Email:
                                    </label>
                                </td>
                                <td>
                                    <input name="email" email="email" type="text" onChange={this.handleInputChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="pass">
                                        Password:
                                    </label>
                                </td>
                                <td>
                                    <input name="pass" password = "password" type="text" onChange={this.handleInputChange} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <input className="login-submit-button" type="submit" value="Sign In" />
                    <button className="login-submit-button" onClick={this.createAccount}>Create Account</button>
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