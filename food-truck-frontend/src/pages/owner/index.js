import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import axios from 'axios';
import { logout as authLogout } from '../../redux/actions/auth';

function OwnerDash(props) {
    const router = useRouter();

    useEffect(() => {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/me`, {
            auth: {
                username: props.auth.email,
                password: props.auth.password
            }
        }).then(res => {
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${res.data.id}/trucks`, {
                auth: {
                    username: props.auth.email,
                    password: props.auth.password
                }
            }).then(res => {
                if (res.data.length > 0) {
                    router.push('/owner/trucks');
                }
            }).catch(err => {

            });
        }).catch(err => {
            props.authLogout();
            router.push('/login')
        });
    }, []);

    return (
        <ul>
            <h2>New Owner Dashboard</h2>
            Want to create a truck? Click <Link href="/owner/trucks/create">here</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(OwnerDash);