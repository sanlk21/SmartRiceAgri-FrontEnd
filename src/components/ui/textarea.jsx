import { cn } from '@/lib/utils'; // Ensure you have this utility function or replace with your preferred method for handling class names
import PropTypes from 'prop-types';
import React from 'react';

export const Textarea = React.forwardRef(
    ({ className, rows = 3, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                rows={rows}
                className={cn(
                    'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50',
                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
    className: PropTypes.string,
    rows: PropTypes.number,
};
