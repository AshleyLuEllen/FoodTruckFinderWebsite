import React from 'react';
import Link from 'next/link'
require('dotenv').config();

function SearchPage() {
    return (
        <ul>
            <h2>Search Page</h2>
            <li>
                <Link href="search/map">
                    <a>Map</a>
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

export default SearchPage