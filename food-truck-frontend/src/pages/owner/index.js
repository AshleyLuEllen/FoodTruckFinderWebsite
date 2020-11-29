import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import requests from '../../util/requests';
import { logout as authLogout } from '../../redux/actions/auth';
import Head from 'next/dist/next-server/lib/head';

function OwnerDash(props) {
    const router = useRouter();

    useEffect(() => {
        requests
            .getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me`, props.auth)
            .then(res => {
                requests
                    .getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/${res.data.id}/trucks`, props.auth)
                    .then(res => {
                        if (res.data.length > 0) {
                            router.push('/owner/trucks');
                        }
                    })
                    .catch(() => {});
            })
            .catch(() => {
                props.authLogout();
                router.push('/login');
            });
    }, []);

    return (
        <div>
            <Head>
                <title>My Trucks</title>
            </Head>
        </div>
    );
}

OwnerDash.propTypes = {
    auth: PropTypes.any,
    authLogout: PropTypes.func,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    authLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(OwnerDash);
