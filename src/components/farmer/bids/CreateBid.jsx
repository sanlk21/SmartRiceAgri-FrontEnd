import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { bidService } from '@/services/bidService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RiceVarieties = [
  { id: 'SAMBA', name: 'සම්බා (Samba)' },
  { id: 'KIRI_SAMBA', name: 'කිරි සම්බා (Kiri Samba)' },
  { id: 'NADU', name: 'නාඩු (Nadu)' },
  { id: 'KEKULU', name: 'කැකුළු (Kekulu)' },
  { id: 'RED_SAMBA', name: 'රතු සම්බා (Red Samba)' },
  { id: 'RED_NADU', name: 'රතු නාඩු (Red Nadu)' },
  { id: 'SUWANDEL', name: 'සුවදැල් (Suwandel)' },
  { id: 'KALU_HEENATI', name: 'කලු හීනටි (Kalu Heenati)' },
  { id: 'PACHCHAPERUMAL', name: 'පච්චපෙරුමාල් (Pachchaperumal)' },
  { id: 'MADATHAWALU', name: 'මඩතාවලු (Madathawalu)' },
  { id: 'KURULUTHUDA', name: 'කුරුළුතුඩ (Kuruluthuda)' },
  { id: 'RATH_SUWANDEL', name: 'රත් සුවදැල් (Rath Suwandel)' },
  { id: 'HETADA_WEE', name: 'හේටද වී (Hetada Wee)' },
  { id: 'GONABARU', name: 'ගොනබරු (Gonabaru)' },
  { id: 'MURUNGAKAYAN', name: 'මුරුංගකයාන් (Murungakayan)' }
];

const CreateBid = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '',
    minimumPrice: '',
    riceVariety: '',
    description: '',
    location: '',
    harvestDate: '',
  });

  const validateForm = () => {
    if (!user?.nic) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to create a bid"
      });
      return false;
    }

    // Check for required fields
    const validationFields = {
      riceVariety: "Please select a rice variety",
      quantity: "Please enter a valid quantity",
      minimumPrice: "Please enter a valid minimum price",
      location: "Location is required",
      harvestDate: "Harvest date is required"
    };

    for (const [field, message] of Object.entries(validationFields)) {
      if (!formData[field] || (typeof formData[field] === 'number' && formData[field] <= 0)) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: message
        });
        return false;
      }
    }

    // Validate quantity and price
    if (parseFloat(formData.quantity) <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Quantity must be greater than 0"
      });
      return false;
    }

    if (parseFloat(formData.minimumPrice) <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Minimum price must be greater than 0"
      });
      return false;
    }

    // Validate harvest date is in the future
    const harvestDate = new Date(formData.harvestDate);
    harvestDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (harvestDate < today) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Harvest date must be in the future"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Create bid data object
      const bidData = {
        farmerNic: user.nic,
        quantity: parseFloat(formData.quantity),
        minimumPrice: parseFloat(formData.minimumPrice),
        riceVariety: formData.riceVariety,
        description: formData.description || '',
        location: formData.location,
        harvestDate: new Date(formData.harvestDate).toISOString()
      };

      console.log('Creating bid with data:', bidData);

      await bidService.createBid(bidData);
      
      toast({
        title: "Success",
        description: "Bid created successfully!"
      });

      // Reset form
      setFormData({
        quantity: '',
        minimumPrice: '',
        riceVariety: '',
        description: '',
        location: '',
        harvestDate: ''
      });

      // Navigate to bid list after short delay
      setTimeout(() => {
        navigate('/farmer/bids/list');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating bid:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to create bid'
      });
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Bid</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity (kg)*</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  quantity: e.target.value === '' ? '' : e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Price (per kg)*</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter minimum price"
                value={formData.minimumPrice}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  minimumPrice: e.target.value === '' ? '' : e.target.value
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rice Variety*</label>
            <Select
              value={formData.riceVariety}
              onValueChange={(value) => setFormData({ ...formData, riceVariety: value })}
            >
              <SelectTrigger className="min-w-[250px]">
                <SelectValue placeholder="Select rice variety" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[400px] overflow-y-auto">
                {RiceVarieties.map((variety) => (
                  <SelectItem 
                    key={variety.id} 
                    value={variety.id}
                    className="py-2 hover:bg-gray-100"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{variety.name.split(' (')[0]}</span>
                      <span className="text-sm text-gray-500">
                        {variety.name.match(/\(([^)]+)\)/)?.[1]}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location*</label>
            <Input
              placeholder="Enter location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Harvest Date*</label>
            <Input
              type="date"
              min={getMinDate()}
              value={formData.harvestDate}
              onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter additional details about your rice"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Bid'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateBid;