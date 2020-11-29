import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from "next/dist/next-server/lib/head";

function FriendsPage() {
    const router = useRouter();

    return (
        <ul>
            <Head>
                <title>Friends</title>
            </Head>
            <h2>User {router.query.user_id} friends</h2>
            TODO: stub
            <li>
                <Link href={`/user/${router.query.user_id}`}>Back</Link>
            </li>
        </ul>
    );
}

export default FriendsPage;
