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

const RiceVarieties = [
  { id: 'SAMBA', name: 'සම්බා (Samba)' },
{ id: 'KIRI_SAMBA', name: 'කිරි සම්බා (Kiri Samba)' },
{ id: 'NADU', name: 'නාදු (Nadu)' },
{ id: 'KEKULU', name: 'කැකුළු (Kekulu)' },
{ id: 'RED_SAMBA', name: 'රතු සම්බා (Red Samba)' },
{ id: 'RED_NADU', name: 'රතු නාදු (Red Nadu)' },
{ id: 'SUWANDEL', name: 'සුවන්දෙල් (Suwandel)' },
{ id: 'KALU_HEENATI', name: 'කලු හීනටි (Kalu Heenati)' },
{ id: 'PACHCHAPERUMAL', name: 'පච්චපෙරුමාල් (Pachchaperumal)' },
{ id: 'MADATHAWALU', name: 'මඩතාවලු (Madathawalu)' },
{ id: 'KURULUTHUDA', name: 'කුරුළුතුඩ (Kuruluthuda)' },
{ id: 'RATH_SUWANDEL', name: 'රත් සුවන්දෙල් (Rath Suwandel)' },
{ id: 'HETADA_WEE', name: 'හේටද වී (Hetada Wee)' },
{ id: 'GONABARU', name: 'ගොනබරු (Gonabaru)' },
{ id: 'MURUNGAKAYAN', name: 'මුරුංගකයාන් (Murungakayan)' }

];

const CreateBid = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await bidService.createBid({
        ...formData,
        farmerNic: user?.nic,
        status: 'PENDING'
      });
      
      setFormData({
        quantity: '',
        minimumPrice: '',
        riceVariety: '',
        description: '',
        location: '',
        harvestDate: ''
      });
      
      toast({
        title: "Success",
        description: "Bid created successfully!"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to create bid'
      });
    } finally {
      setLoading(false);
    }
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
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || '' })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Price (per kg)*</label>
              <Input
                type="number"
                placeholder="Enter minimum price"
                value={formData.minimumPrice}
                onChange={(e) => setFormData({ ...formData, minimumPrice: parseFloat(e.target.value) || '' })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rice Variety*</label>
            <Select
              value={formData.riceVariety}
              onValueChange={(value) => setFormData({ ...formData, riceVariety: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rice variety" />
              </SelectTrigger>
              <SelectContent className="h-[200px]">
                {RiceVarieties.map((variety) => (
                  <SelectItem 
                    key={variety.id} 
                    value={variety.id}
                    className="py-2"
                  >
                    {variety.name}
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