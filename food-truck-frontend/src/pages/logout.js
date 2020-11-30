import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout as authLogout } from '../redux/actions/auth';
import { withRouter } from 'next/router';
import Head from 'next/dist/next-server/lib/head';
import { Container } from '@material-ui/core';

function Logout(props) {
    useEffect(() => {
        props.authLogout();
        props.router.push('/');
    }, []);

    return (
        <Container style={{ marginTop: '20px' }}>
            <Head>
                <title>Logout</title>
            </Head>
            <p>Redirecting...</p>
        </Container>
    );
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
