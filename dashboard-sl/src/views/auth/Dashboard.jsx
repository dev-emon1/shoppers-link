'use client';
import React, { useState } from 'react';
import {
    ShoppingCart, DollarSign, Package, Star, Home, BarChart3, Users, Settings, LogOut, Menu, X,
    Building, User, MapPinIcon, PhoneIcon, MailIcon
} from 'lucide-react';

const Dashboard = ({ vendorInfo, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const stats = [
        { name: 'Total Orders', value: '124', change: '+12%', icon: ShoppingCart, color: 'bg-blue-500' },
        { name: 'Revenue', value: '$12,450', change: '+8.2%', icon: DollarSign, color: 'bg-green-500' },
        { name: 'Products', value: '42', change: '+3', icon: Package, color: 'bg-orange-500' },
        { name: 'Avg. Rating', value: '4.8', change: '+0.2', icon: Star, color: 'bg-yellow-500' }
    ];

    const recentOrders = [
        { id: '#ORD-001', customer: 'John Smith', amount: '$245.00', status: 'Delivered', date: '2024-06-15' },
        { id: '#ORD-002', customer: 'Sarah Johnson', amount: '$189.50', status: 'Processing', date: '2024-06-14' },
        { id: '#ORD-003', customer: 'Mike Davis', amount: '$320.75', status: 'Shipped', date: '2024-06-13' },
        { id: '#ORD-004', customer: 'Emma Wilson', amount: '$156.25', status: 'Delivered', date: '2024-06-12' }
    ];

    const SidebarContent = () => (
        <>
            <div className="flex items-center justify-between px-4 py-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{vendorInfo.businessName}</p>
                        <p className="text-xs text-gray-500">Vendor Dashboard</p>
                    </div>
                </div>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 px-2 space-y-1">
                {[
                    { name: 'Dashboard', icon: Home, href: '#' },
                    { name: 'Orders', icon: Package, href: '#' },
                    { name: 'Products', icon: ShoppingCart, href: '#' },
                    { name: 'Analytics', icon: BarChart3, href: '#' },
                    { name: 'Customers', icon: Users, href: '#' },
                    { name: 'Settings', icon: Settings, href: '#' }
                ].map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-700"
                    >
                        <item.icon className="w-5 h-5 mr-3 text-orange-600" />
                        {item.name}
                    </a>
                ))}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="w-5 h-5 mr-3 text-red-600" />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar button */}
            <div className="md:hidden fixed top-4 left-4 z-20">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'fixed inset-0 z-30' : 'hidden md:flex'} md:fixed md:inset-y-0 md:left-0 md:z-10 md:w-64 md:shadow-lg`}>
                <div className="relative flex-1 flex flex-col min-h-0 bg-white">
                    <SidebarContent />
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className={`${sidebarOpen ? 'hidden' : 'md:ml-64'} transition-all duration-300`}>
                <main className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                        </div>
                                        <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                                        <span className="text-gray-500 text-sm ml-2">from last month</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Recent Orders & Business Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recentOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">{order.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{order.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Business Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <Building className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Business Name</p>
                                            <p className="font-medium text-gray-900">{vendorInfo.businessName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <User className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Owner Name</p>
                                            <p className="font-medium text-gray-900">{vendorInfo.ownerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPinIcon className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="font-medium text-gray-900">{vendorInfo.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <PhoneIcon className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium text-gray-900">{vendorInfo.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <MailIcon className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{vendorInfo.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-700">
                                        <Package className="w-5 h-5 mr-3 text-orange-600" />
                                        Add New Product
                                    </button>
                                    <button className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-700">
                                        <BarChart3 className="w-5 h-5 mr-3 text-orange-600" />
                                        View Analytics
                                    </button>
                                    <button className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-700">
                                        <Settings className="w-5 h-5 mr-3 text-orange-600" />
                                        Account Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;