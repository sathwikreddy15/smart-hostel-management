import React, { useState } from 'react';
import { useLeaveRequests } from '../hooks/useLeaveRequests';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatDateTime, isDateInPast } from '../utils/dateUtils';

interface LeaveRequestFilters {
    status?: 'pending' | 'approved' | 'rejected';
    search?: string;
}

const LeaveRequests: React.FC = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState<LeaveRequestFilters>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const { leaveRequests, loading, error, createLeaveRequest, updateLeaveRequest, deleteLeaveRequest } = useLeaveRequests();

    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        parentContact: ''
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value === 'all' ? undefined : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedRequest) {
                await updateLeaveRequest(selectedRequest._id, formData);
            } else {
                await createLeaveRequest(formData);
            }
            setShowAddModal(false);
            setSelectedRequest(null);
            setFormData({ startDate: '', endDate: '', reason: '', parentContact: '' });
        } catch (err) {
            console.error('Error saving leave request:', err);
        }
    };

    const handleDelete = async (requestId: string) => {
        if (window.confirm('Are you sure you want to delete this leave request?')) {
            try {
                await deleteLeaveRequest(requestId);
            } catch (err) {
                console.error('Error deleting leave request:', err);
            }
        }
    };

    const handleStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
        try {
            await updateLeaveRequest(requestId, { status });
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const filteredRequests = leaveRequests.filter(request => {
        if (filters.status && request.status !== filters.status) return false;
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                request.reason.toLowerCase().includes(searchLower) ||
                request.student.name.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                Error loading leave requests: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Leave Requests</h1>
                {user?.role === 'student' && (
                    <button
                        onClick={() => {
                            setSelectedRequest(null);
                            setFormData({ startDate: '', endDate: '', reason: '', parentContact: '' });
                            setShowAddModal(true);
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                    >
                        New Leave Request
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <select
                        name="status"
                        onChange={handleFilterChange}
                        className="border rounded-md p-2"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <input
                        type="text"
                        name="search"
                        placeholder="Search leave requests..."
                        onChange={handleFilterChange}
                        className="border rounded-md p-2"
                    />
                </div>

                <div className="space-y-4">
                    {filteredRequests.map(request => (
                        <div key={request._id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-lg">{request.student.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-sm text-gray-500">
                                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Parent Contact: {request.parentContact}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Requested on: {formatDateTime(request.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {user?.role === 'admin' && request.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(request._id, 'approved')}
                                                className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                                className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {(user?.role === 'admin' || request.student._id === user?._id) && (
                                        <button
                                            onClick={() => handleDelete(request._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedRequest ? 'Edit Leave Request' : 'New Leave Request'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Reason
                                </label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={e => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    rows={4}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Parent Contact Number
                                </label>
                                <input
                                    type="tel"
                                    name="parentContact"
                                    value={formData.parentContact}
                                    onChange={e => setFormData(prev => ({ ...prev, parentContact: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                    pattern="[0-9]{10}"
                                    placeholder="10-digit mobile number"
                                />
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSelectedRequest(null);
                                    }}
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                                >
                                    {selectedRequest ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveRequests; 