import { formatRelative } from 'date-fns'; // Importing `date-fns` for relative time formatting
import { AlertTriangle, Bell, Check, XCircle } from 'lucide-react'; // Assuming you want to use these icons
import PropTypes from 'prop-types'; // Import PropTypes for validation
//import React from 'react';

// Helper function to determine the icon based on the notification type
const getNotificationIcon = (type) => {
    switch (type) {
        case 'success':
            return <Check className="h-5 w-5 text-green-500" />;
        case 'warning':
            return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case 'error':
            return <XCircle className="h-5 w-5 text-red-500" />;
        default:
            return <Bell className="h-5 w-5 text-gray-500" />;
    }
};

// Helper function to format timestamp relative to now
const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    return formatRelative(new Date(timestamp), new Date());
};

const NotificationItem = ({ notification }) => {
    const { type, title, message, timestamp, read } = notification;

    return (
        <div
            className={`p-4 border-b last:border-b-0 ${
                read ? 'bg-white' : 'bg-blue-50'
            }`}
        >
            <div className="flex items-start gap-3">
                <div className="mt-1">{getNotificationIcon(type)}</div>
                <div className="flex-1">
                    <h4 className="font-medium">{title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(timestamp)}
                    </p>
                </div>
            </div>
        </div>
    );
};

// PropTypes for NotificationItem
NotificationItem.propTypes = {
    notification: PropTypes.shape({
        type: PropTypes.string.isRequired, // Notification type (success, warning, error, etc.)
        title: PropTypes.string.isRequired, // Notification title
        message: PropTypes.string.isRequired, // Notification message
        timestamp: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date),
        ]).isRequired, // Timestamp of the notification
        read: PropTypes.bool.isRequired, // Whether the notification is read
    }).isRequired,
};

export default NotificationItem;
