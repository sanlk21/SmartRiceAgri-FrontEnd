//import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Check, X } from 'lucide-react';
import PropTypes from 'prop-types'; // For prop validation

const AlertItem = ({ alert, onRemove }) => {
    const getAlertStyles = (type) => {
        switch (type) {
            case 'BID_PLACED':
                return {
                    icon: <Bell className="h-4 w-4 text-blue-500" />,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200'
                };
            case 'BID_WON':
                return {
                    icon: <Check className="h-4 w-4 text-green-500" />,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200'
                };
            case 'BID_EXPIRED':
                return {
                    icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200'
                };
            default:
                return {
                    icon: <Bell className="h-4 w-4 text-gray-500" />,
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200'
                };
        }
    };

    const styles = getAlertStyles(alert.type);

    return (
        <div 
            className={`flex items-start space-x-3 p-3 rounded-lg border ${
                styles.bgColor
            } ${styles.borderColor} ${
                !alert.read ? 'ring-2 ring-blue-100' : ''
            }`}
        >
            <div className="mt-1">{styles.icon}</div>
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{alert.title}</p>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                </p>
            </div>
            <Button
                variant="ghost"
                size="sm"
                className="p-1 hover:bg-gray-100"
                onClick={() => onRemove(alert.id)}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
};

// PropTypes for AlertItem
AlertItem.propTypes = {
    alert: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        timestamp: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date),
        ]).isRequired,
        type: PropTypes.string.isRequired,
        read: PropTypes.bool.isRequired,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default AlertItem;
