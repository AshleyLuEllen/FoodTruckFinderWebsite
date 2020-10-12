import React from 'react';
import Link from 'next/link'
require('dotenv').config();

function AccountPage() {
    return (
        <ul>
            <h2>Account Page</h2>
            <li>
                <Link href="account/[user_id]">
                    <a>User</a>
                </Link>
            </li>
            <li>
                <Link href="account/favorites">
                    <a>Favorites</a>
                </Link>
            </li>
            <li>
                <Link href="account/foodie_friends">
                    <a>My Friends</a>
                </Link>
            </li>
            <li>
                <Link href="account/notifications">
                    <a>Notifications</a>
                </Link>
            </li>
            <li>
                <Link href="account/settings">
                    <a>Settings</a>
                </Link>
            </li>
            <li>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </li>
            <li>
                <Link href="account/dashboard">
                    <a>Dashboard</a>
                </Link>
            </li>
        </ul>
    )
}

export default AccountPage
