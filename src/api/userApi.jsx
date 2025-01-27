// src/api/userApi.jsx
import axios from './axios';

export const userApi = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await axios.get('/api/users');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },

    // Get user by NIC
    getUserByNic: async (nic) => {
        try {
            const response = await axios.get(`/api/users/${nic}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user');
        }
    },

    // Update user
    updateUser: async (nic, userData) => {
        try {
            const response = await axios.put(`/api/users/${nic}`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update user');
        }
    },

    // Delete user
    deleteUser: async (nic) => {
        try {
            await axios.delete(`/api/users/${nic}`);
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete user');
        }
    },

    // Update user status (active/inactive)
    updateUserStatus: async (nic, status) => {
        try {
            const response = await axios.patch(`/api/users/${nic}/status`, { status });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update user status');
        }
    },

    // Request password reset
    requestPasswordReset: async (email) => {
        try {
            await axios.post('/api/users/reset-password/request', { email });
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to request password reset');
        }
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        try {
            await axios.post('/api/users/reset-password/confirm', {
                token,
                newPassword
            });
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to reset password');
        }
    },

    // Get users by role
    getUsersByRole: async (role) => {
        try {
            const response = await axios.get(`/api/users/role/${role}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users by role');
        }
    },

    // Admin functions
    // Update user role
    updateUserRole: async (nic, role) => {
        try {
            const response = await axios.patch(`/api/users/${nic}/role`, { role });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update user role');
        }
    },

    // Bulk delete users
    bulkDeleteUsers: async (nics) => {
        try {
            await axios.post('/api/users/bulk-delete', { nics });
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete users');
        }
    },

    // Bulk update user status
    bulkUpdateStatus: async (nics, status) => {
        try {
            const response = await axios.patch('/api/users/bulk-status', { nics, status });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update users status');
        }
    },

    // Get user statistics
    getUserStats: async () => {
        try {
            const response = await axios.get('/api/users/stats');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
        }
    }
};