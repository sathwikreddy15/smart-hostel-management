import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validateMobileNumber, validatePassword } from '../utils/validation';

const Profile: React.FC = () => {
    const { user, updateProfile, updatePassword } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobileNumber: user?.mobileNumber || '',
        rollNumber: user?.rollNumber || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!validateMobileNumber(formData.mobileNumber)) {
            setError('Please enter a valid mobile number');
            return;
        }

        try {
            await updateProfile(formData);
            setSuccess('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validatePassword(passwordData.newPassword)) {
            setError('New password must be at least 6 characters long');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await updatePassword(passwordData.currentPassword, passwordData.newPassword);
            setSuccess('Password updated successfully');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update password');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>

            {(error || success) && (
                <div className={`p-4 rounded-md ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {error || success}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-primary hover:text-primary-dark"
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            ) : (
                                <p className="mt-1 text-gray-900">{user?.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            ) : (
                                <p className="mt-1 text-gray-900">{user?.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mobile Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={formData.mobileNumber}
                                    onChange={e => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                    pattern="[0-9]{10}"
                                />
                            ) : (
                                <p className="mt-1 text-gray-900">{user?.mobileNumber}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Roll Number
                            </label>
                            <p className="mt-1 text-gray-900">{user?.rollNumber}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Security</h2>
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="text-primary hover:text-primary-dark"
                    >
                        Change Password
                    </button>
                </div>
            </div>

            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    }}
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile; 