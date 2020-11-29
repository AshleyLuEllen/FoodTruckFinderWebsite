import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/auth';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Head from "next/dist/next-server/lib/head";

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)',
    },
}));

export default function MaintenancePage() {
    const classes = useStyles();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (router.query.next) {
            axios
                .get(`${process.env.FOOD_TRUCK_API_URL}/ping`)
                .then(() => {
                    router.push(router.query.next);
                })
                .catch(err => {
                    console.log(err);
                    dispatch(logout());
                });
        }
    }, [router.query.next]);

    return (
        <div className={classes.wrapper}>
            <Head>
                <title>Connecting...</title>
            </Head>
            <h1>
                Could not connect to <em>Food Truck Finder</em> server.
            </h1>
            <h2>Please be patient with us and try refreshing the page later.</h2>
        </div>
    );
}
