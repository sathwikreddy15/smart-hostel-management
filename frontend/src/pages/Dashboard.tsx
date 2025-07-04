import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRooms } from '../hooks/useRooms';
import { useComplaints } from '../hooks/useComplaints';
import { useLeaveRequests } from '../hooks/useLeaveRequests';

const StatCard: React.FC<{
    title: string;
    value: number | string;
    icon: string;
    color: string;
}> = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 uppercase">{title}</p>
                <p className="text-2xl font-semibold mt-1">{value}</p>
            </div>
            <div className="text-3xl opacity-80">{icon}</div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { rooms, isLoading: roomsLoading } = useRooms({});
    const { complaints, isLoading: complaintsLoading } = useComplaints();
    const { leaveRequests, isLoading: leaveRequestsLoading } = useLeaveRequests({});

    const isLoading = roomsLoading || complaintsLoading || leaveRequestsLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const AdminDashboard = () => {
        const totalRooms = rooms.length;
        const occupiedRooms = rooms.filter(room => room.isOccupied).length;
        const pendingComplaints = complaints.filter(complaint => complaint.status === 'pending').length;
        const pendingLeaveRequests = leaveRequests.filter(request => request.status === 'pending').length;

        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Rooms"
                        value={totalRooms}
                        icon="🏠"
                        color="border-blue-500"
                    />
                    <StatCard
                        title="Occupied Rooms"
                        value={`${occupiedRooms}/${totalRooms}`}
                        icon="🔑"
                        color="border-green-500"
                    />
                    <StatCard
                        title="Pending Complaints"
                        value={pendingComplaints}
                        icon="📝"
                        color="border-yellow-500"
                    />
                    <StatCard
                        title="Leave Requests"
                        value={pendingLeaveRequests}
                        icon="📅"
                        color="border-purple-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Complaints</h2>
                        {complaints.slice(0, 5).map(complaint => (
                            <div key={complaint._id} className="mb-4 p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{complaint.title}</h3>
                                        <p className="text-sm text-gray-600">{complaint.description}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {complaint.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Leave Requests</h2>
                        {leaveRequests.slice(0, 5).map(request => (
                            <div key={request._id} className="mb-4 p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{request.student.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const StudentDashboard = () => {
        const studentRoom = rooms.find(room => room.students?.some(student => student._id === user?._id));
        const studentComplaints = complaints.filter(complaint => complaint.student._id === user?._id);
        const studentLeaveRequests = leaveRequests.filter(request => request.student._id === user?._id);

        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Room Number"
                        value={studentRoom ? studentRoom.number : 'Not Assigned'}
                        icon="🏠"
                        color="border-blue-500"
                    />
                    <StatCard
                        title="Total Complaints"
                        value={studentComplaints.length}
                        icon="📝"
                        color="border-yellow-500"
                    />
                    <StatCard
                        title="Leave Requests"
                        value={studentLeaveRequests.length}
                        icon="📅"
                        color="border-purple-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Your Room Details</h2>
                        {studentRoom ? (
                            <div>
                                <p><span className="font-medium">Room Number:</span> {studentRoom.number}</p>
                                <p><span className="font-medium">Floor:</span> {studentRoom.floor}</p>
                                <p><span className="font-medium">Type:</span> {studentRoom.type}</p>
                                <p className="mt-2 font-medium">Roommates:</p>
                                <ul className="list-disc list-inside">
                                    {studentRoom.students?.map(student => (
                                        <li key={student._id} className="text-gray-600">
                                            {student.name} {student._id === user?._id && '(You)'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-600">No room assigned yet.</p>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Leave Requests</h2>
                        {studentLeaveRequests.slice(0, 5).map(request => (
                            <div key={request._id} className="mb-4 p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm mt-1">{request.reason}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
};

export default Dashboard; 