import { useEffect, useState } from 'react';
import OwnerRequestService from '../service/OwnerRequestService';
import toast from 'react-hot-toast';

export default function OwnerRequest() {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await OwnerRequestService.viewAllRequest();
            const data = await result.json();
            setResult(data.data);
        } catch (err) {
            console.log(err);
            toast.error(err);
        } finally {
            setLoading(false);
        }
    }


    const approveOwnerRequest = async (id: number) => {
        try {
            setLoading(true);
            const result = await OwnerRequestService.approveRequestService(id);
            const data = await result.json();
            if (result.ok) {
                toast.success(data.message);
                fetchData(); // Refresh the list
            }
        } catch (err) {
            console.log(err);
            toast.error(err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    return { result, loading, approveOwnerRequest };
}

