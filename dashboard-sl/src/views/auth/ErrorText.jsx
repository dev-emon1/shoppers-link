import { AlertCircle } from 'lucide-react';
import React from 'react';

const ErrorText = ({ children }) => {
    return (
        <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {children}
        </div>
    );
};

export default ErrorText;