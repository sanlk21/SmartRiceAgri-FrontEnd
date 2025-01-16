//import React from 'react';
import { cn } from '@/lib/utils'; // Ensure you have a utility function for class names
import PropTypes from 'prop-types';

export const Badge = ({ children, variant = 'default', className, ...props }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        secondary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'secondary', 'success', 'danger', 'warning']),
    className: PropTypes.string,
};
