import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'next/router';

import Link from "next/link";
import { Container } from "@material-ui/core";

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined, userID: undefined };
        this.fetchData = this.fetchData.bind(this);
    }

    fetchData() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userID}`)
            .then(res => {
                this.setState({
                    user: res.data
                });
            })
            .catch(err => {
                this.props.router.push('/404');
            })
    }

    componentDidMount() {
        this.setState({
            userID: this.props.router.query.user_id
        });

        this.fetchData();
    }

    render() {
        return (
            <Container>

            </Container>
        );
    }
}

export default withRouter(UserPage);