import React, { useState } from 'react';
import { useComplaints } from '../hooks/useComplaints';
import { useAuth } from '../contexts/AuthContext';
import { formatDateTime } from '../utils/dateUtils';

interface ComplaintFilters {
    status?: 'pending' | 'resolved' | 'rejected';
    type?: string;
    search?: string;
}

const Complaints: React.FC = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState<ComplaintFilters>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const { complaints, loading, error, createComplaint, updateComplaint, deleteComplaint, voteComplaint } = useComplaints();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'maintenance'
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
            if (selectedComplaint) {
                await updateComplaint(selectedComplaint._id, formData);
            } else {
                await createComplaint(formData);
            }
            setShowAddModal(false);
            setSelectedComplaint(null);
            setFormData({ title: '', description: '', type: 'maintenance' });
        } catch (err) {
            console.error('Error saving complaint:', err);
        }
    };

    const handleVote = async (complaintId: string, voteType: 'upvote' | 'downvote') => {
        try {
            await voteComplaint(complaintId, voteType);
        } catch (err) {
            console.error('Error voting:', err);
        }
    };

    const handleDelete = async (complaintId: string) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            try {
                await deleteComplaint(complaintId);
            } catch (err) {
                console.error('Error deleting complaint:', err);
            }
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        if (filters.status && complaint.status !== filters.status) return false;
        if (filters.type && complaint.type !== filters.type) return false;
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                complaint.title.toLowerCase().includes(searchLower) ||
                complaint.description.toLowerCase().includes(searchLower)
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
                Error loading complaints: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Complaints</h1>
                <button
                    onClick={() => {
                        setSelectedComplaint(null);
                        setFormData({ title: '', description: '', type: 'maintenance' });
                        setShowAddModal(true);
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                    New Complaint
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <select
                        name="status"
                        onChange={handleFilterChange}
                        className="border rounded-md p-2"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        name="type"
                        onChange={handleFilterChange}
                        className="border rounded-md p-2"
                    >
                        <option value="all">All Types</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="cleanliness">Cleanliness</option>
                        <option value="security">Security</option>
                        <option value="other">Other</option>
                    </select>

                    <input
                        type="text"
                        name="search"
                        placeholder="Search complaints..."
                        onChange={handleFilterChange}
                        className="border rounded-md p-2"
                    />
                </div>

                <div className="space-y-4">
                    {filteredComplaints.map(complaint => (
                        <div key={complaint._id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-lg">{complaint.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {complaint.status}
                                        </span>
                                        <span className="text-sm text-gray-500">{complaint.type}</span>
                                        <span className="text-sm text-gray-500">
                                            {formatDateTime(complaint.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleVote(complaint._id, 'upvote')}
                                        className={`p-1 rounded ${
                                            complaint.votes.upvotes.includes(user?._id)
                                                ? 'text-green-600'
                                                : 'text-gray-400'
                                        }`}
                                    >
                                        👍 {complaint.votes.upvotes.length}
                                    </button>
                                    <button
                                        onClick={() => handleVote(complaint._id, 'downvote')}
                                        className={`p-1 rounded ${
                                            complaint.votes.downvotes.includes(user?._id)
                                                ? 'text-red-600'
                                                : 'text-gray-400'
                                        }`}
                                    >
                                        👎 {complaint.votes.downvotes.length}
                                    </button>
                                    {(user?.role === 'admin' || complaint.student._id === user?._id) && (
                                        <button
                                            onClick={() => handleDelete(complaint._id)}
                                            className="text-red-600 hover:text-red-900 ml-2"
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
                            {selectedComplaint ? 'Edit Complaint' : 'New Complaint'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    rows={4}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                >
                                    <option value="maintenance">Maintenance</option>
                                    <option value="cleanliness">Cleanliness</option>
                                    <option value="security">Security</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSelectedComplaint(null);
                                    }}
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                                >
                                    {selectedComplaint ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Complaints; 