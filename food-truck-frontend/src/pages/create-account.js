import React, { Component } from 'react';
import Link from "next/link";

class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: '', firstName:'', lastName:''};
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
            <div className="create-account-form">
                <h2>Create Account</h2>
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
                                <label htmlFor="firstname">
                                    First Name:
                                </label>
                            </td>
                            <td>
                                <input name="firstname" firstname="firstname" type="text" onChange={this.handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="lastname">
                                    Last Name:
                                </label>
                            </td>
                            <td>
                                <input name="lastname" lastname="lastname" type="text" onChange={this.handleInputChange}/>
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
                        <tr>
                            <td>
                                <label htmlFor="pass-conf">
                                    Re-enter Password:
                                </label>
                            </td>
                            <td>
                                <input name="pass-conf" conf-password="pass-conf" type="text" onChange={this.handleInputChange}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button className="login-submit-button" onClick={this.createAccount}>Create Account</button>
                </form>
                <br />
                <label>{this.state.message}</label>
                <li>
                    <Link href="/">
                        <a>Cancel</a>
                    </Link>
                </li>
            </div>
        );
    }
}
export default CreateAccount;