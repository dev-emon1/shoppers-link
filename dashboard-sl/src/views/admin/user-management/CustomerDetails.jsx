// src/views/vendor/user-management/CustomerDetails.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, ShoppingBag, Package, CreditCard } from 'lucide-react';
import API from '../../../utils/api';
import { useParams, Link } from 'react-router-dom';

const CustomerDetails = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const res = await API.get('/customers', {
                    params: { with_orders: true, customer_id: id }
                });
                const found = res.data.data.find(c => c.id === parseInt(id));
                setCustomer(found || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id]);

    if (loading) return <div className="p-12 text-center text-gray-600">Loading customer details...</div>;
    if (!customer) return <div className="p-12 text-center text-red-600">Customer not found</div>;

    const orders = customer.orders || [];
    const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const totalOrders = orders.length;

    const segment = totalOrders >= 20 || totalSpent >= 400000 ? 'VIP' :
        totalOrders >= 10 || totalSpent >= 200000 ? 'Loyal' :
            totalOrders <= 2 && totalOrders > 0 ? 'New' :
                totalOrders === 0 ? 'Inactive' : 'Regular';

    const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formatCurrency = (amt) => `৳ ${Number(amt || 0).toLocaleString()}`;

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            {/* Back Button */}
            <Link to="/vendor/users/customers" className="inline-flex items-center gap-2 text-main hover:underline mb-6 text-sm font-medium">
                <ArrowLeft size={18} /> Back to Customers
            </Link>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-2">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-main to-mainHover flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                        {customer.full_name.charAt(0)}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-gray-800">{customer.full_name}</h1>
                        <p className="text-md text-gray-600">Customer ID: #{customer.id}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 justify-center md:justify-start">
                            <span className={`px-2 py-1 rounded-full text-sm font-bold
                                ${segment === 'VIP' ? 'bg-purple-100 text-purple-800' :
                                    segment === 'Loyal' ? 'bg-blue-100 text-blue-800' :
                                        segment === 'New' ? 'bg-green-100 text-green-800' :
                                            segment === 'Inactive' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                {segment}
                            </span>
                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                <Calendar size={16} /> Joined {formatDate(customer.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <ShoppingBag className="w-8 h-8 text-main mx-auto mb-3" />
                    <div className='flex gap-2 items-center justify-center'>
                        <p className="text-gray-600">Total Orders:</p>
                        <p className="text-xl font-bold text-gray-800">{totalOrders}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(totalSpent)}</p>
                    <p className="text-gray-600">Total Spent</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <Mail className="w-8 h-8 text-main mx-auto mb-3" />
                    <p className="text-lg font-medium break-all">{customer.user?.email || '—'}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <Phone className="w-8 h-8 text-main mx-auto mb-3" />
                    <p className="text-lg font-medium">{customer.contact_number || customer.user?.phone || '—'}</p>
                </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-8 py-5 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Order History ({totalOrders})</h2>
                </div>

                {orders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No orders placed yet</div>
                ) : (
                    <div className="divide-y">
                        {orders.map((order) => {
                            const vendorOrder = order.vendor_orders?.[0];
                            const items = vendorOrder?.items || [];

                            return (
                                <div key={order.id} className="p-4 hover:bg-gray-50 transition">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-main text-lg">{order.unid}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status || 'Processing'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {formatDate(order.created_at)} • {items.length} items
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">
                                                {formatCurrency(order.total_amount)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.payment_method?.toUpperCase()} • {order.payment_status}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {items.map((item) => (
                                            <div key={item.unid} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.product?.name || 'Product'}</p>
                                                    <p className="text-xs text-gray-600">
                                                        {item.variant?.attributes ? Object.values(JSON.parse(item.variant.attributes)).join(' • ') : ''}
                                                    </p>
                                                    <p className="text-sm font-bold mt-1">
                                                        {formatCurrency(item.price)} × {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetails;