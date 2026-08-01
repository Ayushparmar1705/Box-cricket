import { useEffect, useState } from 'react';
import Cityservice from '../service/Cityservice';
import toast from 'react-hot-toast';
import type { StatusOption } from '../../../components/common/Filter/StatusFilter';

export default function useCity() {
    // Controls whether the Add/Edit modal is open
    const [isOpen, setIsOpen] = useState(false);

    // Track if we are editing an existing city
    const [editingId, setEditingId] = useState<number | null>(null);

    // The input values typed in the form
    const [cityName, setCityName] = useState('');
    const [stateName, setStateName] = useState('');
    
    const [result, setResult] = useState<any[]>([]);

    // Status filter state
    const [activeFilter, setActiveFilter] = useState<StatusOption>('all');

    // Open and close modal
    const openModal = () => setIsOpen(true);
    
    const openEditModal = (id: number, currentName: string, currentState: string) => {
        setEditingId(id);
        setCityName(currentName);
        setStateName(currentState);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setEditingId(null);
        setCityName('');
        setStateName(''); // clear input when closing
    };

    // Add a new city or update an existing one
    const handleAdd = async () => {
        try {
            let res;
            if (editingId) {
                res = await Cityservice.updateCity(editingId, cityName, stateName);
            } else {
                res = await Cityservice.addCity(cityName, stateName);
            }
            
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || (editingId ? 'City updated successfully' : 'City added successfully'));
                closeModal();
                getCity(); // Refresh list after saving
            } else {
                toast.error(data.message || 'Failed to save city');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const res = await Cityservice.deleteCity(id);
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || 'City deleted successfully');
                getCity(); // Refresh list after deleting
            } else {
                toast.error(data.message || 'Failed to delete city');
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch all cities (client-side filtering will be applied if needed)
    const getCity = async () => {
        try {
            const res = await Cityservice.getCity(activeFilter);
            const data = await res.json();
            if (res.ok) {
                setResult(data.data);
            } else {
                toast.error(data.message);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // Re-fetch cities whenever the activeFilter changes
    useEffect(() => {
        getCity();
    }, [activeFilter]);

    return {
        isOpen,
        cityName,
        setCityName,
        stateName,
        setStateName,
        openModal,
        openEditModal,
        closeModal,
        handleAdd,
        handleDelete,
        result,
        activeFilter,
        setActiveFilter,
        editingId
    };
}
