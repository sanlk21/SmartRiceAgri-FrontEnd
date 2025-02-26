import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    bidUpdates: true,
    orderStatus: true,
    paymentUpdates: true,
    systemAnnouncements: true
  });

  const handleSettingChange = (setting) => {
    setSettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] };
      
      // In a real application, you would save these settings to the database
      // For now, we'll just show a toast notification
      toast({
        title: "Settings Updated",
        description: `${setting} notifications ${newSettings[setting] ? 'enabled' : 'disabled'}`
      });
      
      return newSettings;
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Bid Updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about bids on your listings
            </p>
          </div>
          <Switch 
            checked={settings.bidUpdates} 
            onCheckedChange={() => handleSettingChange('bidUpdates')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Order Status</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about changes to your orders
            </p>
          </div>
          <Switch 
            checked={settings.orderStatus}
            onCheckedChange={() => handleSettingChange('orderStatus')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Payment Updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive payment confirmations and reminders
            </p>
          </div>
          <Switch 
            checked={settings.paymentUpdates}
            onCheckedChange={() => handleSettingChange('paymentUpdates')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>System Announcements</Label>
            <p className="text-sm text-muted-foreground">
              Important updates and announcements about the platform
            </p>
          </div>
          <Switch 
            checked={settings.systemAnnouncements}
            onCheckedChange={() => handleSettingChange('systemAnnouncements')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;