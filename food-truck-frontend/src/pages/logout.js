import React, { Component } from 'react';
import Link from "next/link";
import { connect, useDispatch } from 'react-redux';
import { logout as authLogout } from '../redux/actions/auth';

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeStatus(event) {
    }
    handleInputChange(event) {
    }
    handleSubmit(event) {
    }
    componentDidMount() {
        this.props.authLogout();
    }
    render() {
        return (
            <div>
                <h2>Logout</h2>
                <li>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
  }
  
const mapDispatchToProps = {
    authLogout
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);