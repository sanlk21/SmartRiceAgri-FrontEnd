// src/routes/notifications/AdminBroadcast.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { notificationService } from "@/services/notificationService";
import { useState } from "react";

const AdminBroadcast = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const data = {
        title: formData.get('title'),
        description: formData.get('description')
      };

      await notificationService.createBroadcast(data);
      
      toast({
        title: "Success",
        description: "Broadcast message sent successfully"
      });
      
      // Reset form
      e.target.reset();

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send broadcast message",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Broadcast Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label>Title</label>
            <Input
              {...register('title', { required: true })}
              placeholder="Broadcast title"
            />
          </div>
          
          <div className="space-y-2">
            <label>Message</label>
            <Textarea
              {...register('description', { required: true })}
              placeholder="Enter your broadcast message"
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Broadcast'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminBroadcast;