import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
//import { Switch } from '@/components/ui/switch';
import React from 'react';

const NotificationSettings = () => {
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
          <Switch defaultChecked={true} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Order Status</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about changes to your orders
            </p>
          </div>
          <Switch defaultChecked={true} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Payment Updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive payment confirmations and reminders
            </p>
          </div>
          <Switch defaultChecked={true} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>System Announcements</Label>
            <p className="text-sm text-muted-foreground">
              Important updates and announcements about the platform
            </p>
          </div>
          <Switch defaultChecked={true} />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;