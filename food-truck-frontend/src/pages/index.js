import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import axios from "axios";

import { useRouter } from 'next/router';
import { connect, useDispatch } from 'react-redux';
import { logout as authLogout } from '../redux/actions/auth';

require('dotenv').config();

function HomePage(props) {
    const router = useRouter();
    const dispatch = useDispatch();

    const [emailMessage, setEmailMessage] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/user`, {
                auth: {
                    username: props.auth.email,
                    password: props.auth.password
                }
            })
            .then(res => {
                setEmailMessage(`Logged in as ${res.data.firstName} ${res.data.lastName}`);
                setLoading(false);
            })
            .catch(err => {
                setEmailMessage("Not logged in.");
                setLoading(false);
                dispatch(props.authLogout());
            });
    }, []);

    return (
        <ul>
            <h1>Home Page (Food Truck Finder - Group 1)</h1>
            <h2>{!loading && emailMessage}</h2>
            <li>
                <Link href="/login">
                    <a>Login</a>
                </Link>
            </li>
            <li>
                <Link href="/logout">
                    <a>Logout</a>
                </Link>
            </li>
            <li>
                <Link href="/search">
                    <a>Search</a>
                </Link>
            </li>
            <li>
                <Link href="/[truck_id]">
                    <a>Trucks!</a>
                </Link>
            </li>
            <li>
                <Link href="/account">
                    <a>Account</a>
                </Link>
            </li>
        </ul>
    )
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}
  
const mapDispatchToProps = {
    authLogout
}
  
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);