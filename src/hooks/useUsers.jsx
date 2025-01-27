// src/hooks/useUsers.js
import { useCallback, useEffect, useState } from 'react';
import { userApi } from '../api/userApi';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = async (nic, userData) => {
    try {
      const updatedUser = await userApi.updateUser(nic, userData);
      setUsers(users.map(user => 
        user.nic === nic ? updatedUser : user
      ));
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (nic) => {
    try {
      await userApi.deleteUser(nic);
      setUsers(users.filter(user => user.nic !== nic));
    } catch (err) {
      throw err;
    }
  };

  const updateUserStatus = async (nic, status) => {
    try {
      const updatedUser = await userApi.updateUserStatus(nic, status);
      setUsers(users.map(user => 
        user.nic === nic ? updatedUser : user
      ));
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser,
    updateUserStatus
  };
};