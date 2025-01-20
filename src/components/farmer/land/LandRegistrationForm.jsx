import { landApi } from '@/api/landApi';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const LandRegistrationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    size: '',
    location: '',
    district: '',
    proofUpload: null, // File input for document
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      proofUpload: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.nic) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append('farmerNic', user.nic); // Add farmer NIC
      form.append('size', formData.size); // Land size
      form.append('location', formData.location); // Land location
      form.append('district', formData.district); // District

      if (formData.proofUpload) {
        form.append('document', formData.proofUpload); // Upload document
      }

      await landApi.registerLand(form);

      toast({
        title: "Success",
        description: "Land registered successfully",
      });

      setFormData({ size: '', location: '', district: '', proofUpload: null }); // Reset the form
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Land registration error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to register land",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Size (in hectares)</label>
        <input
          type="number"
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">District</label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Proof Document</label>
        <input
          type="file"
          name="proofUpload"
          onChange={handleFileChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register Land'}
      </button>
    </form>
  );
};

export default LandRegistrationForm;
