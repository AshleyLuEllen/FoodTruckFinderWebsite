import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';

function SearchPage(props) {
    const router = useRouter();

    return (
        <ul>
            <h2>Manage Truck</h2>
            TODO: stub
            <li>
                <Link href={`/owner/trucks/${router.query.truck_id}`}>Back</Link>
            </li>
        </ul>
    )
}

export default SearchPage;