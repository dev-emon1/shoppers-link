'use client';
import React from 'react';
import { Building, User, MapPin, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, FileText } from 'lucide-react';

const ErrorText = ({ children }) => (
    <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle className="w-4 h-4 mr-1" />
        {children}
    </div>
);

const RegisterForm = ({
    formData,
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit,
    isSubmitting,
    setShowTermsModal,
}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-800 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-orange-600" />
                    Partner Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building className="h-5 w-5 text-orange-400" />
                            </div>
                            <input
                                type="text"
                                name="shop_name"
                                value={formData.shop_name}
                                onChange={handleChange}
                                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.shop_name ? 'border-red-300' : 'border-orange-300'
                                    }`}
                                placeholder="Enter your business name"
                            />
                        </div>
                        {errors.shop_name && <ErrorText>{errors.shop_name}</ErrorText>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-orange-400" />
                            </div>
                            <input
                                type="text"
                                name="owner_name"
                                value={formData.owner_name}
                                onChange={handleChange}
                                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.owner_name ? 'border-red-300' : 'border-orange-300'
                                    }`}
                                placeholder="Enter owner name"
                            />
                        </div>
                        {errors.owner_name && <ErrorText>{errors.owner_name}</ErrorText>}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trade Licence Number *</label>
                    <input
                        type="text"
                        name="trade_license"
                        value={formData.trade_license}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.trade_license ? 'border-red-300' : 'border-orange-300'
                            }`}
                        placeholder="Enter Trade Licence Number"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-orange-400" />
                        </div>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.address ? 'border-red-300' : 'border-orange-300'
                                }`}
                            placeholder="Enter full business address"
                        />
                    </div>
                    {errors.address && <ErrorText>{errors.address}</ErrorText>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                        <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.businessType ? 'border-red-300' : 'border-orange-300'
                                }`}
                        >
                            <option value="">Select business type</option>
                            {businessTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.businessType && <ErrorText>{errors.businessType}</ErrorText>}
                    </div> */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">eTIN *</label>
                        <input
                            type="text"
                            name="etin"
                            value={formData.etin}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.etin ? 'border-red-300' : 'border-orange-300'
                                }`}
                            placeholder="Enter e-TIN Number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">NID *</label>
                        <input
                            type="text"
                            name="nid"
                            value={formData.nid}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.nid ? 'border-red-300' : 'border-orange-300'
                                }`}
                            placeholder="Enter national identification number"
                        />
                        {errors.nid && <ErrorText>{errors.nid}</ErrorText>}
                    </div>
                </div>

            </div>

            {/* Contact Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-800 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-orange-600" />
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-orange-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.email ? 'border-red-300' : 'border-orange-300'
                                    }`}
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && <ErrorText>{errors.email}</ErrorText>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-orange-400" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.phone ? 'border-red-300' : 'border-orange-300'
                                    }`}
                                placeholder="Enter phone number"
                            />
                        </div>
                        {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                    </div>
                </div>
            </div>

            {/* Account Security */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-800 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-orange-600" />
                    Account Security
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-orange-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`pl-10 w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.password ? 'border-red-300' : 'border-orange-300'
                                    }`}
                                placeholder="Create a strong password"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showPassword ? <EyeOff className="h-5 w-5 text-orange-400" /> : <Eye className="h-5 w-5 text-orange-400" />}
                            </button>
                        </div>
                        {errors.password && <ErrorText>{errors.password}</ErrorText>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-orange-400" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`pl-10 w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.confirmPassword ? 'border-red-300' : 'border-orange-300'
                                    }`}
                                placeholder="Confirm your password"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-orange-400" /> : <Eye className="h-5 w-5 text-orange-400" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                    </div>
                </div>
            </div>

            {/* Terms */}
            <div className="pt-4">
                <div className="flex items-start">
                    <input
                        id="termsAccepted"
                        name="termsAccepted"
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-orange-300 rounded"
                    />
                    <div className="ml-3 text-sm">
                        <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                            I agree to the{' '}
                            <button type="button" onClick={() => setShowTermsModal(true)} className="text-orange-600 hover:text-orange-500 font-medium inline-flex items-center">
                                Terms & Conditions <FileText className="w-4 h-4 ml-1" />
                            </button>
                        </label>
                        {errors.termsAccepted && <ErrorText>{errors.termsAccepted}</ErrorText>}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-white py-3 px-4 rounded-lg hover:bg-secondaryHover disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
                {isSubmitting ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </div>
                ) : 'Register Vendor Account'}
            </button>
        </form>
    );
};

export default RegisterForm;