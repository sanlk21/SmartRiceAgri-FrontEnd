// src/components/admin/land/LandVerificationToast.jsx
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const showVerificationToast = (landData) => {
  if (landData.status === 'VERIFIED') {
    toast({
      title: "Land Verified",
      description: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Land has been verified successfully</span>
          </div>
          <div className="text-sm">
            <p>Fertilizer quotas calculated:</p>
            <ul className="mt-1 space-y-1">
              <li>Nitrogen: {landData.nitrogenQuota?.toFixed(2)} kg</li>
              <li>Phosphorus: {landData.phosphorusQuota?.toFixed(2)} kg</li>
              <li>Potassium: {landData.potassiumQuota?.toFixed(2)} kg</li>
            </ul>
          </div>
        </div>
      ),
      variant: "success",
      duration: 5000,
    });
  } else if (landData.status === 'REJECTED') {
    toast({
      title: "Land Rejected",
      description: (
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>Land verification has been rejected</span>
        </div>
      ),
      variant: "destructive",
      duration: 5000,
    });
  }
};