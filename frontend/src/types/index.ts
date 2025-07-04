export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    rollNumber: string;
    mobileNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Room {
    _id: string;
    number: string;
    floor: number;
    type: 'single' | 'double' | 'triple';
    capacity: number;
    isOccupied: boolean;
    students: User[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Complaint {
    _id: string;
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
    type: 'maintenance' | 'cleanliness' | 'security' | 'other';
    student: User;
    upvotes: string[];
    downvotes: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface LeaveRequest {
    _id: string;
    student: User;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: 'Pending' | 'Parent Approval Pending' | 'Approved' | 'Rejected';
    parentContact: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: Partial<User>) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export interface RoomFilters {
    floor?: number;
    type?: string;
    status?: 'occupied' | 'vacant';
    search?: string;
}

export interface ComplaintFilters {
    status?: 'Pending' | 'In Progress' | 'Resolved';
    type?: string;
    search?: string;
}

export interface LeaveRequestFilters {
    status?: 'Pending' | 'Parent Approval Pending' | 'Approved' | 'Rejected';
    search?: string;
}

export interface UseRoomsProps extends RoomFilters {}

export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    rollNumber: string;
    mobileNumber: string;
    role: 'student' | 'admin';
} 