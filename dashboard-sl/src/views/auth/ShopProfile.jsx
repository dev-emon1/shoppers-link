import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast'; // npm install react-hot-toast
import API, { IMAGE_URL } from '../../utils/api';

export default function ShopProfile({ data }) {
    const [originalData] = useState(data);
    // console.log(data.vendor);
    // backup for cancel
    const [edited, setEdited] = useState({
        shop_name: data.vendor.shop_name || '',
        owner_name: data.vendor.owner_name || '',
        contact_number: data.vendor.contact_number || '',
        description: data.vendor.description || '',
        address: data.vendor.address || '',
        city: data.vendor.city || '',
        state: data.vendor.state || '',
        postal_code: data.vendor.postal_code || '',
        country: data.vendor.country || '',
        link: data.vendor.link || '',
        logo: data.vendor.logo || '',
        banner: data.vendor.banner || '',
        nid_front: data.vendor.nid_front || '',
        nid_back: data.vendor.nid_back || '',
        trade_license: data.vendor.trade_license || '',
    });

    const [loading, setLoading] = useState(false);
    const fileInputRefs = useRef({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEdited(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (name, file) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setEdited(prev => ({ ...prev, [name]: file })); // store file object
        // Show preview
        if (fileInputRefs.current[name]) {
            fileInputRefs.current[name].style.backgroundImage = `url(${url})`;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();

        // শুধু টেক্সট ফিল্ডগুলো
        const textFields = [
            'shop_name', 'owner_name', 'contact_number', 'description',
            'address', 'city', 'state', 'postal_code', 'country', 'link'
        ];

        textFields.forEach(field => {
            formData.append(field, edited[field] || '');
        });

        // শুধু যেগুলো File object তবেই পাঠাবো
        const fileFields = ['logo', 'banner', 'nid_front', 'nid_back', 'trade_license'];
        fileFields.forEach(field => {
            if (edited[field] && edited[field] instanceof File) {
                formData.append(field, edited[field]);
            }
            // যদি string থাকে (পুরানো পাথ), কিছুই পাঠাবো না → সার্ভারে পুরানোটা থাকবে
        });

        try {
            const res = await API.post('/profile/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                toast.success('Profile updated successfully!');
                // Optional: refetch profile
            } else {
                toast.error(res.data.message || 'Update failed');
            }
        } catch (err) {
            console.error(err);
            const errors = err.response?.data?.errors;
            if (errors) {
                Object.values(errors).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setEdited({
            shop_name: originalData.vendor.shop_name || '',
            owner_name: originalData.vendor.user_name || '',
            contact_number: originalData.vendor.contact_number || '',
            description: originalData.vendor.description || '',
            address: originalData.vendor.address || '',
            city: originalData.vendor.city || '',
            state: originalData.vendor.state || '',
            postal_code: originalData.vendor.postal_code || '',
            country: originalData.vendor.country || '',
            link: originalData.vendor.link || '',
            logo: originalData.vendor.logo || '',
            banner: originalData.vendor.banner || '',
            nid_front: originalData.vendor.nid_front || '',
            nid_back: originalData.vendor.nid_back || '',
            trade_license: originalData.vendor.trade_license || '',
        });
        toast.info('Changes discarded');
    };

    const readOnlyField = (label, value) => (
        <div>
            <label className="text-xs font-semibold text-gray-500">{label}</label>
            <p className="mt-1 text-sm text-gray-800">{value || '—'}</p>
        </div>
    );

    const editableField = (label, name, type = 'text') => (
        <div>
            <label className="text-xs font-semibold text-gray-500">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={edited[name]}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={edited[name]}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
            )}
        </div>
    );

    const imageSlot = (label, name, src, size = 'medium') => {
        // সাইজ অনুযায়ী হাইট-উইড্থ
        const sizeClasses = {
            small: 'h-32 w-32',        // NID, Trade License
            medium: 'h-40 w-full',     // Logo
            large: 'h-48 w-full',      // Banner
        };

        const currentImage = edited[name] instanceof File
            ? URL.createObjectURL(edited[name])
            : src ? `${IMAGE_URL}/${src}` : null;

        return (
            <div>
                <label className="text-xs font-semibold text-gray-500">{label}</label>
                <label
                    className={`group relative mt-2 block ${sizeClasses[size]} cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 bg-gray-50 transition-all`}
                >
                    {currentImage ? (
                        <img
                            src={currentImage}
                            alt={label}
                            className="h-full w-full object-cover rounded-lg"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-gray-400">
                            <svg className="h-8 w-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4 16l16-12 16 12v20a4 4 0 01-4 4H8a4 4 0 01-4-4V16z"
                                />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M20 32l8-8m-8 8l-8-8m16 8l8-8"
                                />
                            </svg>
                            <span className="text-xs">Click to upload</span>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition">
                        <span className="text-white text-sm font-medium">Change Image</span>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(name, e.target.files[0])}
                    />
                </label>
            </div>
        );
    };

    return (
        <div className="mx-auto max-w-5xl p-6">
            <div className="grid gap-6 rounded-xl bg-white p-6 shadow-lg">
                {/* Banner */}
                <div className="col-span-full">
                    {imageSlot('Banner Image', 'banner', edited.banner)}
                </div>
                {/* Top Row */}
                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="md:w-1/6">{imageSlot('Logo', 'logo', edited.logo)}</div>
                    <div className="flex-1 space-y-4">
                        {editableField('Partner Name', 'shop_name')}
                        {editableField('Owner Name', 'owner_name')}
                        {editableField('Contact Number', 'contact_number')}
                    </div>
                    <div className="md:w-1/4 space-y-4">
                        {readOnlyField('Username', data.user.user_name)}
                        {readOnlyField('Email', data.user.email)}
                        {readOnlyField('Phone', data.user.phone)}
                        {readOnlyField('Account Type', data.user.type === 'vendor' ? 'Partner' : 'Customer')}
                    </div>
                </div>

                {/* Description */}
                {editableField('Description', 'description', 'textarea')}

                {/* Address */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {editableField('Address', 'address')}
                    {editableField('City', 'city')}
                    {editableField('State', 'state')}
                    {editableField('Postal Code', 'postal_code')}
                    {editableField('Country', 'country')}
                    {editableField('Link', 'link')}
                </div>

                {/* Documents */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {imageSlot('NID Front', 'nid_front', edited.nid_front)}
                    {imageSlot('NID Back', 'nid_back', edited.nid_back)}
                    {imageSlot('Trade License', 'trade_license', edited.trade_license)}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    {/* <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="rounded-md px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button> */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-md bg-main px-6 py-2 text-sm font-medium text-white hover:mainHover disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}