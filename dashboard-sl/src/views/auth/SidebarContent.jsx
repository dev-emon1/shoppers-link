import { Building, LogOut, X } from 'lucide-react';
import React from 'react';

const SidebarContent = ({ setSidebarOpen, onLogout }) => {
    return (
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
};

export default SidebarContent;