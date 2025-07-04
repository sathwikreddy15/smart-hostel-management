import { useState, useEffect } from 'react';
import { roomsApi, Room } from '../services/api';

interface UseRoomsProps {
    filters?: {
        floor?: number;
        type?: string;
        isOccupied?: boolean;
        sortBy?: string;
    };
}

export const useRooms = ({ filters }: UseRoomsProps = {}) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRooms();
    }, [filters]);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await roomsApi.getAll(filters);
            setRooms(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch rooms');
        } finally {
            setLoading(false);
        }
    };

    const createRoom = async (data: Partial<Room>) => {
        try {
            const response = await roomsApi.create(data);
            setRooms(prev => [...prev, response.data]);
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to create room');
        }
    };

    const updateRoom = async (id: string, data: Partial<Room>) => {
        try {
            const response = await roomsApi.update(id, data);
            setRooms(prev =>
                prev.map(room =>
                    room._id === id ? response.data : room
                )
            );
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to update room');
        }
    };

    const deleteRoom = async (id: string) => {
        try {
            await roomsApi.delete(id);
            setRooms(prev => prev.filter(room => room._id !== id));
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to delete room');
        }
    };

    const getRoomLayout = async (floor: number) => {
        try {
            const response = await roomsApi.getLayout(floor);
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to fetch room layout');
        }
    };

    const assignStudent = async (roomId: string, studentId: string) => {
        try {
            const response = await roomsApi.assignStudent(roomId, studentId);
            setRooms(prev =>
                prev.map(room =>
                    room._id === roomId ? response.data : room
                )
            );
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to assign student to room');
        }
    };

    const removeStudent = async (roomId: string, studentId: string) => {
        try {
            const response = await roomsApi.removeStudent(roomId, studentId);
            setRooms(prev =>
                prev.map(room =>
                    room._id === roomId ? response.data : room
                )
            );
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to remove student from room');
        }
    };

    return {
        rooms,
        loading,
        error,
        createRoom,
        updateRoom,
        deleteRoom,
        getRoomLayout,
        assignStudent,
        removeStudent,
        refreshRooms: fetchRooms
    };
}; 