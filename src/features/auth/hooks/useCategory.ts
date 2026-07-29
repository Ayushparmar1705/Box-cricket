import { useEffect, useState } from 'react';
import Categoryservice from '../service/Categoryservice';
import toast from 'react-hot-toast';

// This hook manages state for the Category page
export default function useCategory() {

    // Controls whether the Add modal is open
    const [isOpen, setIsOpen] = useState(false);

    // The input value typed in the form
    const [categoryName, setCategoryName] = useState('');
    const [result, setResult] = useState([]);
    // Open and close modal
    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setCategoryName(''); // clear input when closing
    };

    // Add a new category to the list
    const handleAdd = async () => {
        try {
            const result = await Categoryservice.AddCategory(categoryName);
            const data = await result.json();
            if (data) {
                toast.success(data.message);
                closeModal();
                await getCategory(); // ✅ refresh table after adding
            }
        } catch (err) {
            console.log(err);
        }
    }


    const getCategory = async () => {
        try {
            const result = await Categoryservice.getCategory();
            const data = await result.json();
            if (result.ok) {
                setResult(data.data);
            } else {
                toast.error(data.message);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategory();
    }, []);
    return {
        isOpen,
        categoryName,
        setCategoryName,
        openModal,
        closeModal,
        handleAdd,
        result,
    };
}
