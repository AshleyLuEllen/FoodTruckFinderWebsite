import React, {useEffect, useState} from 'react';
import Link from 'next/link'
import {useRouter} from "next/router";
require('dotenv').config();
import axios from "axios";

function TruckPage() {
    const router = useRouter();
    const [pageMessage, setPageMessage] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [truckFound, setTruckFound] = useState(true);

    useEffect(() => {
        console.log(router.query);

        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/truck/${router.query.truck_id}`)
            .then(res => {
                setPageMessage(`${res.data.name} Truck Page`);
                setLoading(false);
                setTruckFound(true);
            })
            .catch(err => {
                console.log(err);
                setPageMessage("Truck not found");
                setLoading(false);
                setTruckFound(false);
            });
    });

    return (
        <ul>
            <h2>{!loading && pageMessage}</h2>
            {truckFound &&
            <li>
                <Link href={`${router.query.truck_id}/information`}>
                    <a>Truck Details</a>
                </Link>
            </li> }
            {truckFound &&
            <li>
                <Link href={`${router.query.truck_id}/manage`}>
                    <a>Manage Truck</a>
                </Link>
            </li>}
            {truckFound &&
            <li>
                <Link href={`${router.query.truck_id}/notifications`}>
                    <a>Notifications</a>
                </Link>
            </li>}
            {truckFound &&
            <li>
                <Link href={`${router.query.truck_id}/reviews`}>
                    <a>Truck Reviews</a>
                </Link>
            </li>}
            {truckFound &&
            <li>
                <Link href={`${router.query.truck_id}/schedule`}>
                    <a>Truck Schedule</a>
                </Link>
            </li>}
            <li>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </li>
        </ul>
    )
}

export default TruckPage