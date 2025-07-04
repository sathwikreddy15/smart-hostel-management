import { useState, useEffect } from 'react';
import { complaintsApi, Complaint } from '../services/api';

interface UseComplaintsProps {
    filters?: {
        status?: string;
        type?: string;
        sortBy?: string;
    };
}

export const useComplaints = ({ filters }: UseComplaintsProps = {}) => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchComplaints();
    }, [filters]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await complaintsApi.getAll(filters);
            setComplaints(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const createComplaint = async (data: Partial<Complaint>) => {
        try {
            const response = await complaintsApi.create(data);
            setComplaints(prev => [...prev, response.data]);
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to create complaint');
        }
    };

    const updateComplaint = async (id: string, data: Partial<Complaint>) => {
        try {
            const response = await complaintsApi.update(id, data);
            setComplaints(prev =>
                prev.map(complaint =>
                    complaint._id === id ? response.data : complaint
                )
            );
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to update complaint');
        }
    };

    const deleteComplaint = async (id: string) => {
        try {
            await complaintsApi.delete(id);
            setComplaints(prev => prev.filter(complaint => complaint._id !== id));
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to delete complaint');
        }
    };

    const voteComplaint = async (id: string, voteType: 'upvote' | 'downvote') => {
        try {
            const response = await complaintsApi.vote(id, voteType);
            setComplaints(prev =>
                prev.map(complaint =>
                    complaint._id === id ? response.data : complaint
                )
            );
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to vote on complaint');
        }
    };

    return {
        complaints,
        loading,
        error,
        createComplaint,
        updateComplaint,
        deleteComplaint,
        voteComplaint,
        refreshComplaints: fetchComplaints
    };
}; 