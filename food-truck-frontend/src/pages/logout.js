import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { logout as authLogout } from '../redux/actions/auth';
import { withRouter } from 'next/router';

function Logout(props) {
    useEffect(() => {
        props.authLogout();
        props.router.push("/");
    }, []);

    return (
        <div>
            Redirecting...
        </div>
    )
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
  }
  
const mapDispatchToProps = {
    authLogout
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logout));