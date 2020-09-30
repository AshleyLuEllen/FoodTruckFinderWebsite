import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";

class CreateAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {email: '', password: '', passConf:'', firstName:'', lastName:''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createAccount = this.createAccount.bind(this);
    }

    handleChangeStatus(event) {
    }

    handleInputChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    handleSubmit(event) {

    }

    componentDidMount() {
    }

    createAccount(){
        const user = {
            emailAddress: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password
        }

        axios.post(process.env.FOOD_TRUCK_API_URL + "/createuser", user)
            .then( (res) => {
                this.props.router('/login')
            })
            .catch((err) => {
                alert("errE")
                console.log(err);
            });


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
                                <input name="email" email="email" type="text" value={this.state.email} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="firstName">
                                    First Name:
                                </label>
                            </td>
                            <td>
                                <input name="firstName" type="text" value={this.state.firstName} onChange={this.handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="lastName">
                                    Last Name:
                                </label>
                            </td>
                            <td>
                                <input name="lastName" type="text" value={this.state.lastName} onChange={this.handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="password">
                                    Password:
                                </label>
                            </td>
                            <td>
                                <input name="password" type="text" value={this.state.password} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="passConf">
                                    Re-enter Password:
                                </label>
                            </td>
                            <td>
                                <input name="passConf" type="text" value={this.state.passConf} onChange={this.handleInputChange}/>
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