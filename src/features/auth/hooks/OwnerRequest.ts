import { useEffect, useState } from 'react';
import OwnerRequestService from '../service/OwnerRequestService';

export default function OwnerRequest() {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const response = await OwnerRequestService.viewAllRequest();
            const data = await response.json();
            setResult(data.data);
        } catch (err) {
            console.log(err);
        } finally {
            // Ensure loading bar shows for at least 2 seconds
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 2000 - elapsed);
            setTimeout(() => setLoading(false), remaining);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { result, loading };
}

