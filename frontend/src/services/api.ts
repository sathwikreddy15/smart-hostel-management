import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Complaints API
export const complaintsApi = {
    create: (data: any) => axios.post(`${API_URL}/complaints`, data),
    getAll: (filters?: any) => axios.get(`${API_URL}/complaints`, { params: filters }),
    getById: (id: string) => axios.get(`${API_URL}/complaints/${id}`),
    update: (id: string, data: any) => axios.put(`${API_URL}/complaints/${id}`, data),
    delete: (id: string) => axios.delete(`${API_URL}/complaints/${id}`),
    vote: (id: string, voteType: 'upvote' | 'downvote') => 
        axios.post(`${API_URL}/complaints/${id}/vote`, { voteType })
};

// Leave Requests API
export const leavesApi = {
    create: (data: any) => axios.post(`${API_URL}/leaves`, data),
    getAll: (filters?: any) => axios.get(`${API_URL}/leaves`, { params: filters }),
    getById: (id: string) => axios.get(`${API_URL}/leaves/${id}`),
    update: (id: string, data: any) => axios.put(`${API_URL}/leaves/${id}`, data),
    delete: (id: string) => axios.delete(`${API_URL}/leaves/${id}`)
};

// Rooms API
export const roomsApi = {
    create: (data: any) => axios.post(`${API_URL}/rooms`, data),
    getAll: (filters?: any) => axios.get(`${API_URL}/rooms`, { params: filters }),
    getById: (id: string) => axios.get(`${API_URL}/rooms/${id}`),
    update: (id: string, data: any) => axios.put(`${API_URL}/rooms/${id}`, data),
    delete: (id: string) => axios.delete(`${API_URL}/rooms/${id}`),
    getLayout: (floor: number) => axios.get(`${API_URL}/rooms/layout/${floor}`),
    assignStudent: (roomId: string, studentId: string) => 
        axios.post(`${API_URL}/rooms/${roomId}/assign`, { studentId }),
    removeStudent: (roomId: string, studentId: string) => 
        axios.post(`${API_URL}/rooms/${roomId}/remove`, { studentId })
};

// Types
export interface Complaint {
    _id: string;
    title: string;
    type: string;
    description: string;
    student: any;
    status: 'Pending' | 'In Progress' | 'Resolved';
    isAnonymous: boolean;
    upvotes: string[];
    downvotes: string[];
    resolvedAt?: Date;
    resolvedBy?: any;
    createdAt: Date;
    updatedAt: Date;
}

export interface LeaveRequest {
    _id: string;
    student: any;
    reason: string;
    startDate: Date;
    endDate: Date;
    status: 'Pending' | 'Parent Approval Pending' | 'Approved' | 'Rejected';
    parentApproval: boolean;
    parentApprovalDate?: Date;
    adminApproval: boolean;
    adminApprovalDate?: Date;
    approvedBy?: any;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Room {
    _id: string;
    roomNumber: string;
    floor: number;
    capacity: 2 | 3;
    occupants: any[];
    isOccupied: boolean;
    type: 'two-person' | 'three-person';
    createdAt: Date;
    updatedAt: Date;
} 