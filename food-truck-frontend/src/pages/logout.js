import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout as authLogout } from '../redux/actions/auth';
import { withRouter } from 'next/router';
import Head from "next/dist/next-server/lib/head";

function Logout(props) {
    useEffect(() => {
        props.authLogout();
        props.router.push('/');
    }, []);

    return <div>
        <Head>
            <title>Logout</title>
        </Head>
        Redirecting...</div>;
}

Logout.propTypes = {
    authLogout: PropTypes.func,
    router: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    authLogout,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logout));
