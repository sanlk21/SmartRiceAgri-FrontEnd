import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import PropTypes from 'prop-types';
//import React, { useState } from 'react'; // Added useState import

const NotificationPreferences = ({ initialPreferences, onPreferencesChange }) => {
    const [preferences, setPreferences] = useState(initialPreferences);

    const handleToggle = (key) => {
        const updatedPreferences = {
            ...preferences,
            [key]: !preferences[key],
        };

        setPreferences(updatedPreferences);

        // Notify parent component about changes
        if (onPreferencesChange) {
            onPreferencesChange(updatedPreferences);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Bid Events Section */}
                    <div>
                        <h3 className="font-medium mb-3">Bid Events</h3>
                        <div className="space-y-2">
                            {[
                                { key: 'bidPlaced', label: 'New bids placed' },
                                { key: 'bidWon', label: 'When you win a bid' },
                                { key: 'bidExpired', label: 'When your bid expires' },
                                { key: 'bidUpdates', label: 'Bid status updates' },
                            ].map(({ key, label }) => (
                                <Toggle
                                    key={key}
                                    checked={preferences[key]}
                                    onCheckedChange={() => handleToggle(key)}
                                    label={label}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Notification Methods Section */}
                    <div>
                        <h3 className="font-medium mb-3">Notification Methods</h3>
                        <div className="space-y-2">
                            {[
                                { key: 'emailNotifications', label: 'Email notifications' },
                                { key: 'pushNotifications', label: 'Push notifications' },
                            ].map(({ key, label }) => (
                                <Toggle
                                    key={key}
                                    checked={preferences[key]}
                                    onCheckedChange={() => handleToggle(key)}
                                    label={label}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// PropTypes for NotificationPreferences
NotificationPreferences.propTypes = {
    initialPreferences: PropTypes.shape({
        bidPlaced: PropTypes.bool,
        bidWon: PropTypes.bool,
        bidExpired: PropTypes.bool,
        bidUpdates: PropTypes.bool,
        emailNotifications: PropTypes.bool,
        pushNotifications: PropTypes.bool,
    }),
    onPreferencesChange: PropTypes.func, // Callback to notify parent about preference changes
};

// Default props for NotificationPreferences
NotificationPreferences.defaultProps = {
    initialPreferences: {
        bidPlaced: true,
        bidWon: true,
        bidExpired: true,
        bidUpdates: true,
        emailNotifications: true,
        pushNotifications: true,
    },
    onPreferencesChange: null,
};

export default NotificationPreferences;
