import React, { useEffect, useState } from 'react'
import OwnerRequestService from '../service/OwnerRequestService';

export default function OwnerRequest() {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await OwnerRequestService.viewAllRequest();

            const data = await result.json();

            setResult(data.data);
        } catch (err) {
            setLoading(false);
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    return {
        result,
        loading,
    }
}
