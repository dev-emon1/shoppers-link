'use client';
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import TermsModal from './TermsModal';
import SuccessMessage from './SuccessMessage';
import { useAuth } from '../../utils/AuthContext';
import API from '../../utils/api';

const businessTypes = [
  'Retail Store',
  'Wholesale Distributor',
  'Manufacturer',
  'Service Provider',
  'Online Store',
  'Other',
];

export default function AuthLayout() {
  const { user, login } = useAuth(); // Use AuthContext

  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    login: '',
    password: '',
    type: '',
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    shop_name: '',
    owner_name: '',
    email: '',
    phone: '',
    type: 'vendor',
    address: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    trade_license: '',
    etin: '',
    nid: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // ===== Login Handlers =====
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name]) setLoginErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginData.login.trim()) newErrors.login = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginData.login)) newErrors.login = 'Email is invalid';
    if (!loginData.password) newErrors.password = 'Password is required';
    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoginSubmitting(true);
    setLoginErrors({});
    setServerError('');

    try {
      const response = await API.post('/login', loginData);
      const { token, user } = response.data;
      login(token, user); // Update AuthContext
    } catch (error) {
      console.error('Login Error:', error.response?.data || error);
      setLoginErrors(
        error.response?.data?.errors || { general: 'Login failed. Please try again.' }
      );
      // Show Laravel's exact error message
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Invalid credentials. Please try again.';

      setServerError(msg);
      setLoginErrors({ general: msg });
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  // ===== Registration Handlers =====
  const validateForm = () => {
    const newErrors = {};
    if (!formData.shop_name.trim()) newErrors.shop_name = 'Business name is required';
    if (!formData.owner_name.trim()) newErrors.owner_name = 'Owner name is required';
    if (!formData.etin.trim()) newErrors.etin = 'e-TIN is required';
    if (!formData.trade_license.trim()) newErrors.trade_license = 'Trade Lisense is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = 'Phone number is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.nid.trim()) newErrors.nid = 'NID is required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the Terms & Conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // console.log(formData);

    setIsSubmitting(true);
    try {
      const payload = { ...formData, password_confirmation: formData.confirmPassword };
      delete payload.confirmPassword;

      await API.post('/vendor/register', payload);
      setIsSuccess(true);
    } catch (error) {
      console.error('Registration Error:', error.response?.data || error);
      setErrors(
        error.response?.data?.errors || { general: 'Registration failed. Please try again.' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    setIsSuccess(false);
    setFormData({
      shop_name: '',
      owner_name: '',
      email: '',
      phone: '',
      type: 'vendor',
      address: '',
      password: '',
      confirmPassword: '',
      businessType: '',
      trade_license: '',
      etin: '',
      nid: '',
      termsAccepted: false,
    });
    setErrors({});
  };

  // ===== Redirect if already logged in =====
  if (isSuccess) return <SuccessMessage onRegisterAnother={handleRegisterAnother} />;
  // if (user) return <Navigate to="/admin/dashboard/overview" replace />;
  if (user) {
    const redirectPath =
      user.type === "admin"
        ? "/admin/dashboard/overview"
        : user.type === "vendor"
          ? "/vendor/dashboard"
          : "/";

    return <Navigate to={redirectPath} replace />;
  }

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
                  <img src="/images/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4 text-center">
                  {activeTab === 'login' ? 'Welcome!' : 'Join Our Marketplace'}
                </h2>
                <p className="leading-relaxed">
                  {activeTab === 'login'
                    ? 'Sign in to manage your partner account and access your dashboard.'
                    : 'Become a trusted partner on our platform and reach thousands of customers.'}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                  <span>Access to 45M+ active customers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                  <span>No commission</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                  <span>Dedicated partner support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="md:w-3/5 p-8">
            <div className="flex space-x-1 bg-orange-100 rounded-lg p-1 mb-8 w-fit">
              <button
                onClick={() => setActiveTab('login')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'login' ? 'bg-white text-orange-600 shadow-sm' : 'text-orange-600 hover:text-orange-800'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'register' ? 'bg-white text-orange-600 shadow-sm' : 'text-orange-600 hover:text-orange-800'}`}
              >
                Register
              </button>
            </div>

            {activeTab === 'login' ? (
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
            ) : (
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
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-orange-600">
                {activeTab === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setActiveTab('register')}
                      className="text-orange-600 hover:text-orange-500 font-medium"
                    >
                      Register now
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-orange-600 hover:text-orange-500 font-medium"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
