import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import requests from '../../util/requests';

import { useRouter } from 'next/router';
import { connect } from 'react-redux';

function ProfilePage(props) {
    const router = useRouter();

    useEffect(() => {
        requests
            .getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me`, props.auth)
            .then(res => {
                router.push(`/user/${res.data.id}`);
            })
            .catch(() => {
                router.push('/login');
            });
    }, []);

    return <div>Redirecting...</div>;
}

ProfilePage.propTypes = {
    auth: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
