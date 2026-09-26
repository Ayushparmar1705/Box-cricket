import React, { useEffect, useState } from 'react';
import country from './Countryservice';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Stack,
    CircularProgress
} from '@mui/material';

interface CountryView {
    id: number;
    name: string;
    country_code: string;
}

export default function Countrypage() {
    const columns = [
        { name: 'ID', accessor: 'id' },
        { name: 'Name', accessor: 'name' },
        { name: 'Country Code', accessor: 'country_code' },
        { name: 'Actions', accessor: 'actions' },
    ];

    const [data, setData] = useState<CountryView[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getdata = async () => {
        try {
            setLoading(true);
            const result = await country.view();
            if (result && Array.isArray(result.data)) {
                setData(result.data);
            } else if (Array.isArray(result)) {
                setData(result);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error(err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#1e293b' }}>
                    Countries Management
                </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.accessor} sx={{ fontWeight: 'bold', color: '#64748b' }}>
                                    {col.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                                    <CircularProgress size={32} sx={{ color: '#10b981' }} />
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                                    No countries found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow key={item.id || index} hover>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                                    <TableCell>{item.country_code}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <Button size="small" variant="outlined" color="primary">
                                                Edit
                                            </Button>
                                            <Button size="small" variant="outlined" color="error">
                                                Delete
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
