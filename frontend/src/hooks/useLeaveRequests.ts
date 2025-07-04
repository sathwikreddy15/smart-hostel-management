import { useState, useEffect } from 'react';
import { leavesApi, LeaveRequest } from '../services/api';

interface UseLeaveRequestsProps {
    filters?: {
        status?: string;
        sortBy?: string;
    };
}

export const useLeaveRequests = ({ filters }: UseLeaveRequestsProps = {}) => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaveRequests();
    }, [filters]);

    const fetchLeaveRequests = async () => {
        try {
            setLoading(true);
            const response = await leavesApi.getAll(filters);
            setLeaveRequests(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch leave requests');
        } finally {
            setLoading(false);
        }
    };

    const createLeaveRequest = async (data: Partial<LeaveRequest>) => {
        try {
            const response = await leavesApi.create(data);
            setLeaveRequests(prev => [...prev, response.data]);
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to create leave request');
        }
    };

    const updateLeaveRequest = async (id: string, data: Partial<LeaveRequest>) => {
        try {
            const response = await leavesApi.update(id, data);
            setLeaveRequests(prev =>
                prev.map(request =>
                    request._id === id ? response.data : request
                )
            );
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to update leave request');
        }
    };

    const deleteLeaveRequest = async (id: string) => {
        try {
            await leavesApi.delete(id);
            setLeaveRequests(prev => prev.filter(request => request._id !== id));
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to delete leave request');
        }
    };

    const getLeaveRequestById = async (id: string) => {
        try {
            const response = await leavesApi.getById(id);
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to fetch leave request');
        }
    };

    return {
        leaveRequests,
        loading,
        error,
        createLeaveRequest,
        updateLeaveRequest,
        deleteLeaveRequest,
        getLeaveRequestById,
        refreshLeaveRequests: fetchLeaveRequests
    };
}; 