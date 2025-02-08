// src/routes/notifications/AdminBroadcast.jsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { notificationService } from '@/services/notificationService';
import React from 'react';
import { useForm } from 'react-hook-form';

const AdminBroadcast = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      await notificationService.createBroadcast({
        title: data.title,
        description: data.description
      });
      
      toast({
        title: "Broadcast sent",
        description: "Your message has been broadcast to all users",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send broadcast message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Send Broadcast Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              {...register('title', { required: true })}
              placeholder="Broadcast title"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              {...register('description', { required: true })}
              placeholder="Enter your broadcast message"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Broadcast'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminBroadcast;