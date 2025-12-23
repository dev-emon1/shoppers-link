'use client';
import React from 'react';

const TermsModal = ({ showTermsModal, setShowTermsModal }) => {
    if (!showTermsModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-orange-800">Terms & Conditions</h3>
                        <button onClick={() => setShowTermsModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>
                    <div className="space-y-4 text-sm text-gray-700">
                        <p><strong>Last Updated:</strong> June 1, 2024</p>
                        <h4 className="font-semibold text-orange-700">1. Acceptance of Terms</h4>
                        <p>By registering as a vendor on our platform, you agree to comply with these Terms & Conditions and all applicable laws and regulations.</p>
                        <h4 className="font-semibold text-orange-700">2. Vendor Responsibilities</h4>
                        <p>You are responsible for maintaining accurate business information, providing quality products/services, and adhering to our marketplace policies.</p>
                        <h4 className="font-semibold text-orange-700">3. Commission and Fees</h4>
                        <p>Our standard commission rate is 15% of each transaction. Payment processing fees may apply as per our current fee structure.</p>
                        <h4 className="font-semibold text-orange-700">4. Account Termination</h4>
                        <p>We reserve the right to suspend or terminate vendor accounts that violate our terms, provide false information, or engage in fraudulent activities.</p>
                        <h4 className="font-semibold text-orange-700">5. Data Protection</h4>
                        <p>Your personal and business information will be handled in accordance with our Privacy Policy and applicable data protection laws.</p>
                        <h4 className="font-semibold text-orange-700">6. Dispute Resolution</h4>
                        <p>Any disputes arising from your use of our platform will be resolved through binding arbitration in accordance with local laws.</p>
                        <p className="pt-4">By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.</p>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button onClick={() => setShowTermsModal(false)} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;