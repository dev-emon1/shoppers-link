import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShopProfile from './ShopProfile';   // the component we built earlier
import API from '../../utils/api';

export default function ShopProfilePage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // await API.post('/vendor/register', payload);
        API.get('/profile', { withCredentials: true })   // sanctum cookie
            .then(res => setData(res.data))
            .finally(() => setLoading(false));
    }, []);
    // console.log(data);

    if (loading) return <p className="p-8">Loading…</p>;
    if (!data) return <p className="p-8">Unable to load profile.</p>;

    return <ShopProfile data={data} />;
}