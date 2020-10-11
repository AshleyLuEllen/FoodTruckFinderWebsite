import React from 'react';
import Link from 'next/link'
require('dotenv').config();

function TruckPage() {
    return (
        <ul>
            <h2>Truck Page</h2>
            <li>
                <Link href="[truck_id]/manage">
                    <a>Manage Truck</a>
                </Link>
            </li>
            <li>
                <Link href="[truck_id]/notifications">
                    <a>Notifications</a>
                </Link>
            </li>
            <li>
                <Link href="[truck_id]/reviews">
                    <a>Truck Reviews</a>
                </Link>
            </li>
            <li>
                <Link href="[truck_id]/schedule">
                    <a>Truck Schedule</a>
                </Link>
            </li>
            <li>
                <Link href="[truck_id]/createNew">
                    <a>Create New Truck</a>
                </Link>
            </li>
            <li>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </li>
        </ul>
    )
}

export default TruckPage