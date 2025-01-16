// src/pages/support/UserSupportPage.jsx

// Import necessary dependencies
//import React from 'react';
import { SupportDashboard } from '@/components/support/user/SupportDashboard';

// Define the UserSupportPage component
const UserSupportPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Render the SupportDashboard component */}
            <SupportDashboard />
        </div>
    );
};

// Export the component as the default export
export default UserSupportPage;
