import React, { useEffect } from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)'
    }
}));

export default function MaintenancePage() {
    const classes = useStyles();
    const router = useRouter();

    useEffect(() => {
        if (router.query.next) {
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/ping`)
            .then(res => {
                router.push(router.query.next);
            })
            .catch(err => console.log(err));
        }
    }, [router.query.next]);

    return <div className={classes.wrapper}>
        <h1>Could not connect to <em>Food Truck Finder</em> server.</h1>
        <h2>Please be patient with us and try refreshing the page later.</h2>
    </div>
}