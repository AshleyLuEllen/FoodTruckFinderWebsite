import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Link from 'next/link';
import ChipSelector from '../components/ChipSelector';

function SearchPage() {
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/tags`)
            .then(res => {
                setTagOptions(res.data);
                setSelectedTags(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return (
        <ul>
            <h2>Search Page</h2>
            <ChipSelector 
                label="Tags" 
                options={tagOptions} 
                selectedOptions={selectedTags} 
                onChange={(event, value) => setSelectedTags(value)} 
                onSelectOption={t => console.log(t)} 
                onDeselectOption={t => console.log(t)}
            />
        </ul>
    )
}

export default SearchPage;