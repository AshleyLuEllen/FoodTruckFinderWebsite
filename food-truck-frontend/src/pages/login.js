import React, { Component } from 'react';
import Link from "next/link";
import { withRouter } from 'next/router'
import axios from "axios";
import { connect, useDispatch } from 'react-redux';
import { login as authLogin, logout as authLogout } from '../redux/actions/auth';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: '', loginFailed:false};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeStatus(event) {
    }
    handleInputChange(event) {
        this.setState({
                [event.target.name]: event.target.value
        });
    }
    handleSubmit(event) {
        event.preventDefault()

        console.log(this.state)
        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/basicauth`, {
                auth: {
                    username: this.state.email,
                    password: this.state.password
                }
            })
            .then(res => {
                this.props.authLogin(this.state.email, this.state.password);
                this.props.router.push('/')
            })
            .catch(err => {
                this.setState({
                    loginFailed: true
                });
                this.props.authLogout();
                console.log(err)
            });
    }
    componentDidMount() {
    }

    createAccount = (e) => {
        this.props.router.push('/create-account');
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
                                    <label for="password">
                                        Password:
                                    </label>
                                </td>
                                <td>
                                    <input name="password" password = "password" type="password" onChange={this.handleInputChange} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <input className="login-submit-button" type="submit" value="Sign In" />
                    <button className="login-submit-button" onClick={this.createAccount}>Create Account</button>
                </form>
                <br />
                {this.state.loginFailed && <span>Login failed. Re-enter your username and password.</span>}
                <li>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
  }
  
const mapDispatchToProps = {
    authLogin,
    authLogout
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));