'use client';
import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessMessage = ({ onRegisterAnother }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <h3 className="text-green-800 font-medium">Registration Successful!</h3>
                    </div>
                    <p className="text-green-700 mt-2">
                        Your Partner account has been created successfully. Your application will be reviewed soon and will update you within next 72 hours.
                        Looking forward to work together.
                    </p>
                </div>
                <button
                    onClick={onRegisterAnother}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                    Register Another Vendor
                </button>
            </div>
        </div>
    );
};

export default SuccessMessage;