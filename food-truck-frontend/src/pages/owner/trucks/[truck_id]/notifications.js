import React from 'react';
import Link from 'next/link'
import axios from "axios";
import { useRouter } from 'next/router';
import NotificationCard from "../../../../components/NotificationCard";

function Notifications(props) {
    const router = useRouter();
    const notifications = axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucls/${router.query.truck_id}/notifications`)

    return (
        <ul>
            <h2>Notifications of Truck</h2>
            {notifications.forEach(n => (
                <NotificationCard
                    notification={n}/>
                ))
            })
        </ul>
    )
}

export default Notifications;