import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import axios from 'axios';
import React, { useState } from 'react';

const LandVerification = ({ landId, onVerificationComplete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateLandStatus = async (status) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios({
        method: 'PUT',
        url: `/api/lands/${landId}/status`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ status: status })
      });
      
      if (onVerificationComplete) {
        onVerificationComplete(status);
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Status update error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to update land status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setIsDialogOpen(true)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        disabled={loading}
      >
        Approve
      </button>

      <button
        onClick={() => updateLandStatus('REJECTED')}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        disabled={loading}
      >
        Reject
      </button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Land Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this land? This action will mark the land as officially approved in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateLandStatus('APPROVED')}
              disabled={loading}
              className={loading ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {loading ? 'Approving...' : 'Confirm Approval'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LandVerification;