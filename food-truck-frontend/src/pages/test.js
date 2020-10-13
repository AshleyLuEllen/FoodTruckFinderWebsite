import React, { Component } from 'react';
import { withRouter } from 'next/router'
import axios from "axios";
import { connect, useDispatch } from 'react-redux';
import { login as authLogin, logout as authLogout } from '../redux/actions/auth';

class TestPage extends Component {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TestPage));