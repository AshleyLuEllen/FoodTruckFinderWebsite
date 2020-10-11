import React, { useEffect } from 'react';
import axios from "axios";

import { useRouter } from 'next/router';
import { connect } from 'react-redux';

function ProfilePage(props) {
    const router = useRouter();

    useEffect(() => {
        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/users/me`, {
                auth: {
                    username: props.auth.email,
                    password: props.auth.password
                }
            })
            .then(res => {
                router.push(`/user/${res.data.id}`);
            })
            .catch(err => {
                router.push('/login')
            });
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
    
}
  
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);