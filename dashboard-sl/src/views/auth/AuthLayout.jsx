'use client';
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import TermsModal from './TermsModal';
import SuccessMessage from './SuccessMessage';

const businessTypes = [
    'Retail Store', 'Wholesale Distributor', 'Manufacturer', 'Service Provider', 'Online Store', 'Other'
];

export default function AuthLayout() {
    const [activeTab, setActiveTab] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginErrors, setLoginErrors] = useState({});
    const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '', ownerName: '', email: '', phone: '', address: '', password: '',
        confirmPassword: '', businessType: '', taxId: '', nid: '', termsAccepted: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [vendorInfo, setVendorInfo] = useState(null);
    const [serverError, setServerError] = useState("");
    // Login Handlers
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        if (loginErrors[name]) setLoginErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateLoginForm = () => {
        const newErrors = {};
        if (!loginData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(loginData.email)) newErrors.email = 'Email is invalid';
        if (!loginData.password) newErrors.password = 'Password is required';
        setLoginErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateLoginForm()) return;
        setIsLoginSubmitting(true);

        setTimeout(() => {
            setIsLoginSubmitting(false);
            setIsLoggedIn(true);
            setVendorInfo({
                businessName: 'Tech Solutions Inc.',
                ownerName: 'John Doe',
                email: loginData.email,
                phone: '+1234567890',
                address: '123 Business St, City, State 12345'
            });
        }, 1500);
    };

    // Registration Handlers
    const validateForm = () => {
        const newErrors = {};
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone number is invalid';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.businessType) newErrors.businessType = 'Please select a business type';
        if (!formData.nid.trim()) newErrors.nid = 'NID is required';
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the Terms & Conditions';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 2000);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoginData({ email: '', password: '' });
        setFormData({
            businessName: '', ownerName: '', email: '', phone: '', address: '', password: '',
            confirmPassword: '', businessType: '', taxId: '', nid: '', termsAccepted: false
        });
        setErrors({});
        setLoginErrors({});
        setActiveTab('login');
    };

    const handleRegisterAnother = () => {
        setIsSuccess(false);
        setFormData({
            businessName: '', ownerName: '', email: '', phone: '', address: '', password: '',
            confirmPassword: '', businessType: '', taxId: '', nid: '', termsAccepted: false
        });
        setErrors({});
    };

    if (isSuccess) return <SuccessMessage onRegisterAnother={handleRegisterAnother} />;
    if (isLoggedIn) return <Dashboard vendorInfo={vendorInfo} onLogout={handleLogout} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <TermsModal showTermsModal={showTermsModal} setShowTermsModal={setShowTermsModal} />

            <div className="rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
                <div className="md:flex">
                    {/* Branding */}
                    <div className="md:w-2/5 bg-gradient-to-br from-orange-200 to-orange-400 p-8">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2 justify-center">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                    <img src="/logo.png" alt="Marketplace Logo" className="w-20 h-20 object-contain" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-4 text-center">
                                    {activeTab === 'login' ? 'Welcome!' : 'Join Our Marketplace'}
                                </h2>
                                <p className="leading-relaxed">
                                    {activeTab === 'login'
                                        ? 'Sign in to manage your vendor account and access your dashboard.'
                                        : 'Become a trusted vendor on our platform and reach thousands of customers.'
                                    }
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-green-700" /><span>Access to 40M+ active customers</span></div>
                                <div className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-green-700" /><span>No commission</span></div>
                                <div className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-green-700" /><span>Dedicated vendor support</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Auth Forms */}
                    <div className="md:w-3/5 p-8">
                        <div className="flex space-x-1 bg-orange-100 rounded-lg p-1 mb-8 w-fit">
                            <button onClick={() => setActiveTab('login')} className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'login' ? 'bg-white text-orange-600 shadow-sm' : 'text-orange-600 hover:text-orange-800'}`}>
                                Sign In
                            </button>
                            <button onClick={() => setActiveTab('register')} className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'register' ? 'bg-white text-orange-600 shadow-sm' : 'text-orange-600 hover:text-orange-800'}`}>
                                Register
                            </button>
                        </div>

                        {activeTab === 'login' ? (
                            <div>
                                <h2 className="text-2xl font-bold text-orange-900 mb-6">Vendor Sign In</h2>
                                <LoginForm
                                    loginData={loginData}
                                    loginErrors={loginErrors}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    handleLoginChange={handleLoginChange}
                                    handleLoginSubmit={handleLoginSubmit}
                                    isLoginSubmitting={isLoginSubmitting}
                                    serverError={serverError}
                                />
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold text-orange-900 mb-6">Vendor Registration</h2>
                                <RegisterForm
                                    formData={formData}
                                    errors={errors}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    showConfirmPassword={showConfirmPassword}
                                    setShowConfirmPassword={setShowConfirmPassword}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                    setShowTermsModal={setShowTermsModal}
                                    businessTypes={businessTypes}
                                />
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <p className="text-sm text-orange-600">
                                {activeTab === 'login' ? (
                                    <>Don't have an account? <button onClick={() => setActiveTab('register')} className="text-orange-600 hover:text-orange-500 font-medium">Register now</button></>
                                ) : (
                                    <>Already have an account? <button onClick={() => setActiveTab('login')} className="text-orange-600 hover:text-orange-500 font-medium">Sign in</button></>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}