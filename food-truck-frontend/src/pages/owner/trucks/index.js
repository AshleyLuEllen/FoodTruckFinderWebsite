import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import {login as authLogin, logout as authLogout} from "../../../redux/actions/auth";
import {withRouter} from "next/router";
import { connect, useDispatch } from 'react-redux';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {truckData: [] };
        //this.state = {email: '', password: ''};
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

        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/me`, {
            auth: {
                username: this.props.auth.email,
                password: this.props.auth.password
            }
        })
            .then(res => {
                this.setState({
                    owner: res.data.id
                })

                let userID = this.state.owner;

                //let userID = 1;
                axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${userID}/trucks`)
                    .then(res => {
                        this.setState({
                            truckData: res.data
                        });
                    })
                    .catch(err => {
                        console.log(err.response?.status);
                        console.log(err);
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
                            <Link href={"/owner/trucks/"+tr.id}>
                                <a>{tr.name}</a>
                            </Link>
                        </li>
                    ))}
                </ol>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));