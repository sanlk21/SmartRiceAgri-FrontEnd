import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useState } from 'react';
import { bidService } from '../../../services/bidService';

const CreateBid = () => {
  const [formData, setFormData] = useState({
    quantity: '',
    minimumPrice: '',
    riceVariety: '',
    description: '',
    location: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bidService.createBid(formData);
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
      alert('Failed to create the bid. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Bid</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            placeholder="Quantity (kg)"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Minimum Price (per kg)"
            value={formData.minimumPrice}
            onChange={(e) =>
              setFormData({ ...formData, minimumPrice: e.target.value })
            }
            className="w-full"
          />
          <Select
            value={formData.riceVariety}
            onValueChange={(value) =>
              setFormData({ ...formData, riceVariety: value })
            }
          >
            <option value="">Select Rice Variety</option>
            <option value="SAMBA">Samba</option>
            <option value="NADU">Nadu</option>
            <option value="BASMATI">Basmati</option>
          </Select>
          <Input
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows={4}
          />
          <Button type="submit" className="w-full">
            Create Bid
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateBid;
