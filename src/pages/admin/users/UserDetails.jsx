import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../../../api/userApi';

const UserDetailsPage = () => {
  const { nic } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userApi.getUserByNic(nic);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [nic]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/users')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">NIC:</label>
            <p>{user.nic}</p>
          </div>
          <div>
            <label className="font-semibold">Full Name:</label>
            <p>{user.fullName}</p>
          </div>
          <div>
            <label className="font-semibold">Email:</label>
            <p>{user.email}</p>
          </div>
          <div>
            <label className="font-semibold">Role:</label>
            <p>{user.role}</p>
          </div>
          <div>
            <label className="font-semibold">Status:</label>
            <p>{user.status}</p>
          </div>
          <div>
            <label className="font-semibold">Phone Number:</label>
            <p>{user.phoneNumber}</p>
          </div>
          
          {user.role === 'FARMER' && (
            <>
              <div>
                <label className="font-semibold">Bank Name:</label>
                <p>{user.bankName}</p>
              </div>
              <div>
                <label className="font-semibold">Account Number:</label>
                <p>{user.accountNumber}</p>
              </div>
            </>
          )}
          
          {user.role === 'BUYER' && (
            <>
              <div>
                <label className="font-semibold">Company Name:</label>
                <p>{user.companyName}</p>
              </div>
              <div>
                <label className="font-semibold">Business Registration:</label>
                <p>{user.businessRegNumber}</p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserDetailsPage;