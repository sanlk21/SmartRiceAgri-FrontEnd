import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext'; // Access the logged-in user context
import { useState } from 'react';
import { bidService } from '../../../services/bidService';

const CreateBid = () => {
  const { user } = useAuth(); // Get logged-in user's details
  const [formData, setFormData] = useState({
    quantity: '',
    minimumPrice: '',
    riceVariety: '',
    description: '',
    location: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields
    if (!formData.riceVariety) {
      alert('Please select a valid rice variety.');
      return;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }
    if (!formData.minimumPrice || formData.minimumPrice <= 0) {
      alert('Please enter a valid minimum price.');
      return;
    }
    if (!formData.location) {
      alert('Location is required.');
      return;
    }

    // Prepare data for submission
    const bidData = {
      ...formData,
      farmerNic: user?.nic, // Automatically set the farmerNic from AuthContext
    };

    try {
      await bidService.createBid(bidData); // Call the bid creation service
      setFormData({
        quantity: '',
        minimumPrice: '',
        riceVariety: '',
        description: '',
        location: '',
      });
      alert('Bid created successfully!');
    } catch (error) {
      console.error('Error creating bid:', error);
      alert(error.response?.data?.message || 'Failed to create the bid. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Bid</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quantity Input */}
          <Input
            type="number"
            placeholder="Quantity (kg)"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseFloat(e.target.value) || '' })
            }
            className="w-full"
          />

          {/* Minimum Price Input */}
          <Input
            type="number"
            placeholder="Minimum Price (per kg)"
            value={formData.minimumPrice}
            onChange={(e) =>
              setFormData({ ...formData, minimumPrice: parseFloat(e.target.value) || '' })
            }
            className="w-full"
          />

          {/* Rice Variety Dropdown */}
          <Select
            value={formData.riceVariety}
            onChange={(e) =>
              setFormData({ ...formData, riceVariety: e.target.value })
            }
            className="w-full"
          >
            <option value="">Select Rice Variety</option>
            <option value="SAMBA">Samba</option>
            <option value="KIRI_SAMBA">Kiri Samba</option>
            <option value="NADU">Nadu</option>
            <option value="KEKULU">Kekulu</option>
            <option value="RED_SAMBA">Red Samba</option>
            <option value="RED_NADU">Red Nadu</option>
            <option value="SUWANDEL">Suwandel</option>
            <option value="KALU_HEENATI">Kalu Heenati</option>
            <option value="PACHCHAPERUMAL">Pachchaperumal</option>
            <option value="MADATHAWALU">Madathawalu</option>
            <option value="KURULUTHUDA">Kuruluthuda</option>
            <option value="RATH_SUWANDEL">Rath Suwandel</option>
            <option value="HETADA_WEE">Hetada Wee</option>
            <option value="GONABARU">Gonabaru</option>
            <option value="MURUNGAKAYAN">Murungakayan</option>
          </Select>

          {/* Location Input */}
          <Input
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full"
          />

          {/* Description Input */}
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows={4}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Create Bid
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateBid;
