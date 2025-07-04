import React, { useState } from 'react';
import { useRooms } from '../hooks/useRooms';
import { useAuth } from '../contexts/AuthContext';

interface RoomFilters {
    floor?: string;
    type?: string;
    isOccupied?: boolean;
    search?: string;
}

const Rooms: React.FC = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState<RoomFilters>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const { rooms, loading, error, createRoom, updateRoom, deleteRoom } = useRooms(filters);

    const [formData, setFormData] = useState({
        number: '',
        floor: '',
        type: 'single',
        capacity: 1
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
            if (selectedRoom) {
                await updateRoom(selectedRoom._id, formData);
            } else {
                await createRoom(formData);
            }
            setShowAddModal(false);
            setSelectedRoom(null);
            setFormData({ number: '', floor: '', type: 'single', capacity: 1 });
        } catch (err) {
            console.error('Error saving room:', err);
        }
    };

    const handleEdit = (room: any) => {
        setSelectedRoom(room);
        setFormData({
            number: room.number,
            floor: room.floor,
            type: room.type,
            capacity: room.capacity
        });
        setShowAddModal(true);
    };

    const handleDelete = async (roomId: string) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await deleteRoom(roomId);
            } catch (err) {
                console.error('Error deleting room:', err);
            }
        }
    };

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
                Error loading rooms: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Rooms Management</h1>
                {user?.role === 'admin' && (
                    <button
                        onClick={() => {
                            setSelectedRoom(null);
                            setFormData({ number: '', floor: '', type: 'single', capacity: 1 });
                            setShowAddModal(true);
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                    >
                        Add Room
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <select
                        name="floor"
                        onChange={handleFilterChange}
                        className="border rounded-md p-2"
                    >
                        <option value="all">All Floors</option>
                        {Array.from({ length: 5 }, (_, i) => i + 1).map(floor => (
                            <option key={floor} value={floor}>
                                Floor {floor}
                            </option>
                        ))}
                    </select>

                    <select
                        name="type"
                        onChange={handleFilterChange}
                        className="border rounded-md p-2"
                    >
                        <option value="all">All Types</option>
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="triple">Triple</option>
                    </select>

                    <select
                        name="isOccupied"
                        onChange={handleFilterChange}
                        className="border rounded-md p-2"
                    >
                        <option value="all">All Status</option>
                        <option value="true">Occupied</option>
                        <option value="false">Available</option>
                    </select>

                    <input
                        type="text"
                        name="search"
                        placeholder="Search room number..."
                        onChange={handleFilterChange}
                        className="border rounded-md p-2"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Room Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Floor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Capacity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Occupants
                                </th>
                                {user?.role === 'admin' && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rooms.map(room => (
                                <tr key={room._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{room.number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{room.floor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">{room.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{room.capacity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            room.isOccupied
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {room.isOccupied ? 'Occupied' : 'Available'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <ul className="list-disc list-inside">
                                            {room.students?.map(student => (
                                                <li key={student._id} className="text-sm text-gray-600">
                                                    {student.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    {user?.role === 'admin' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleEdit(room)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedRoom ? 'Edit Room' : 'Add New Room'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Room Number
                                </label>
                                <input
                                    type="text"
                                    name="number"
                                    value={formData.number}
                                    onChange={e => setFormData(prev => ({ ...prev, number: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Floor
                                </label>
                                <input
                                    type="number"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={e => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                    min="1"
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
                                    <option value="single">Single</option>
                                    <option value="double">Double</option>
                                    <option value="triple">Triple</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Capacity
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={e => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                    min="1"
                                    max="3"
                                />
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSelectedRoom(null);
                                    }}
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                                >
                                    {selectedRoom ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms; 