'use client';
import React from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ErrorText = ({ children }) => (
    <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle className="w-4 h-4 mr-1" />
        {children}
    </div>
);

const LoginForm = ({ loginData, loginErrors, showPassword, setShowPassword, handleLoginChange, handleLoginSubmit, isLoginSubmitting, serverError }) => {
    return (
        <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Server Error (from Laravel) */}
            {serverError && (
                <div className="bg-main border border-red-200 text-white px-4 py-3 rounded-lg">
                    <ErrorText>{serverError}</ErrorText>
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-orange-400" />
                    </div>
                    <input
                        type="email"
                        name="login"
                        value={loginData.login}
                        onChange={handleLoginChange}
                        className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${loginErrors.email ? 'border-red-300' : 'border-orange-300'
                            }`}
                        placeholder="Enter your email or phone"
                    />
                </div>
                {loginErrors.login && <ErrorText>{loginErrors.login}</ErrorText>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-orange-400" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className={`pl-10 w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${loginErrors.password ? 'border-red-300' : 'border-orange-300'
                            }`}
                        placeholder="Enter your password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5 text-orange-400" /> : <Eye className="h-5 w-5 text-orange-400" />}
                    </button>
                </div>
                {loginErrors.password && <ErrorText>{loginErrors.password}</ErrorText>}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-orange-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                </div>
                <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-500">Forgot password?</a>
            </div>

            <button
                type="submit"
                disabled={isLoginSubmitting}
                className="w-full bg-secondary text-white py-3 px-4 rounded-lg hover:bg-secondaryHover disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
                {isLoginSubmitting ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                    </div>
                ) : 'Sign In'}
            </button>
        </form>
    );
};

export default LoginForm;