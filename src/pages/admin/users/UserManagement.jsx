import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserManagementComponent } from '../../../components/admin/users/UserManagement';

const UserManagementPage = () => {
  const navigate = useNavigate();

  const handleViewDetails = (nic) => {
    navigate(`/admin/users/${nic}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserManagementComponent onViewDetails={handleViewDetails} />
    </div>
  );
};

export default UserManagementPage;