import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import {login as authLogin, logout as authLogout} from "../../redux/actions/auth";
import {withRouter} from "next/router";
import { connect, useDispatch } from 'react-redux';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = { truckData: [] };
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
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.props.router.query.user_id}/trucks`)
            .then(res => {
                this.setState({
                    truckData: res.data
                });
            })
            .catch(err => {
                console.log(err.response?.status);
                console.log(err);
            })
    }

    componentWillUpdate = () => {
        console.log(this.props.router.query);
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.props.router.query.user_id}/trucks`)
            .then(res => {
                this.setState({
                    truckData: res.data
                });
            })
            .catch(err => {
                console.log(err.response?.status);
                console.log(err);
            })
    };

    render() {
        return (
            <div>
                <h2>Dashboard</h2>
                <ol>
                    {this.state.truckData.map(tr => (
                        <li>
                            <Link href={"/"+tr.id}>
                                <a>{tr.name}</a>
                            </Link>
                        </li>
                    ))}
                </ol>
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

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}

const mapDispatchToProps = {
    authLogin,
    authLogout
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
//export default Dashboard;
/*

import React, { Component } from 'react';
import { withRouter } from 'next/router'
import axios from "axios";
import { connect, useDispatch } from 'react-redux';
import { login as authLogin, logout as authLogout } from '../redux/actions/auth';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = { truckData: [] };
    }

    componentDidMount() {
        let userID = 1;
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${userID}/trucks`)
            .then(res => {
                this.setState({
                    truckData: res.data
                });
            })
            .catch(err => {
                console.log(err.response?.status);
                console.log(err);
            })
    }

    render() {
        return (
            <ul>
                {this.state.truckData.map(truck => (
                    <li>{truck.name}</li>
                ))}
            </ul>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
*/