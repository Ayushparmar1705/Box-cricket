import { useEffect, useState } from 'react';
import Categoryservice from '../service/Categoryservice';
import toast from 'react-hot-toast';
import type { StatusOption } from '../../../components/common/Filter/StatusFilter';

// This hook manages state for the Category page
export default function useCategory() {

    // Controls whether the Add/Edit modal is open
    const [isOpen, setIsOpen] = useState(false);

    // Track if we are editing an existing category
    const [editingId, setEditingId] = useState<number | null>(null);

    // The input value typed in the form
    const [categoryName, setCategoryName] = useState('');
    const [result, setResult] = useState<any[]>([]);

    // Status filter state
    const [activeFilter, setActiveFilter] = useState<StatusOption>('all');

    // Open and close modal
    const openModal = () => setIsOpen(true);

    const openEditModal = (id: number, currentName: string) => {
        setEditingId(id);
        setCategoryName(currentName);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setEditingId(null);
        setCategoryName(''); // clear input when closing
    };

    // Add a new category to the list
    // Add a new category or update an existing one
    const handleAdd = async () => {
        try {
            let result;
            if (editingId) {
                result = await Categoryservice.updateCategory(editingId, categoryName);
            } else {
                result = await Categoryservice.AddCategory(categoryName);
            }

            const data = await result.json();
            if (result.ok) {
                toast.success(data.message || (editingId ? 'Category updated successfully' : 'Category added successfully'));
                closeModal();
                getCategory(); // Refresh list after saving
            } else {
                toast.error(data.message || 'Failed to save category');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const res = await Categoryservice.deleteCategory(id);
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || 'Category deleted successfully');
                getCategory(); // Refresh list after deleting
            } else {
                toast.error(data.message || 'Failed to delete category');
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch all categories (client-side filtering will be applied if needed)
    const getCategory = async () => {
        try {
            const result = await Categoryservice.getCategory(activeFilter);
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

    // Re-fetch categories whenever the activeFilter changes
    useEffect(() => {
        getCategory();
    }, [activeFilter]);

    return {
        isOpen,
        categoryName,
        setCategoryName,
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
