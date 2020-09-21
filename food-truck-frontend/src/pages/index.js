import React from 'react';
import Link from 'next/link'
require('dotenv').config();

function HomePage() {
    return (
        <ul>
            <h1>Home Page</h1>
            <li>
                <Link href="/login">
                    <a>Login</a>
                </Link>
            </li>
            <li>
                <Link href="/logout">
                    <a>Logout</a>
                </Link>
            </li>
            <li>
                <Link href="/search">
                    <a>Search</a>
                </Link>
            </li>
            <li>
                <Link href="/[truck_id]">
                    <a>Trucks!</a>
                </Link>
            </li>
            <li>
                <Link href="/account">
                    <a>Account</a>
                </Link>
            </li>
        </ul>
    )
}

export default HomePage