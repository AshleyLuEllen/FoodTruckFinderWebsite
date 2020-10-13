import React from 'react';
import Link from 'next/link'
require('dotenv').config();

function OwnerDash() {
    return (
        <ul>
            <h2>New Owner Dashboard</h2>
            Want to create a truck? Click <Link href="/owner/trucks/create">here</Link> Note: in the future, if you own a truck already, you will be redirected
        </ul>
    )
}

export default OwnerDash