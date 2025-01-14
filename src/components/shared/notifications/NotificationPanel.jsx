//import React from 'react';
import { Button } from '@/components/ui/button'; // Importing Button component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area'; // Importing ScrollArea component
import PropTypes from 'prop-types'; // For prop validation
import NotificationItem from './NotificationItem'; // Assuming NotificationItem is defined in the same directory

const NotificationPanel = ({ notifications, onClose }) => {
    return (
        <Card className="fixed right-4 top-16 w-96 shadow-lg z-50">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Notifications</CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        ✕
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[70vh]">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                        />
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

// PropTypes for NotificationPanel
NotificationPanel.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired,
            timestamp: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.instanceOf(Date),
            ]).isRequired,
            type: PropTypes.string.isRequired,
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default NotificationPanel;
