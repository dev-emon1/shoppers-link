'use client';
import React, { useState } from 'react';
import {
    RotateCcw,
    PackageCheck,
    CreditCard,
    AlertCircle,
    Truck,
    HelpCircle,
    CheckCircle2,
    Clock,
    XCircle,
    ShieldCheck,
    ChevronRight,
    MessageSquare,
    FileSearch
} from 'lucide-react';

const RefundReturnPolicy = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const steps = [
        {
            title: "Request Return",
            desc: "Initiate return from your order history within 7 days of delivery.",
            icon: <RotateCcw className="text-emerald-600" size={24} />
        },
        {
            title: "Vendor Approval",
            desc: "The specific vendor reviews your request and provides a return label.",
            icon: <FileSearch className="text-blue-600" size={24} />
        },
        {
            title: "Ship Item",
            desc: "Drop off the package. Must be in original condition with tags.",
            icon: <Truck className="text-indigo-600" size={24} />
        },
        {
            title: "Get Refund",
            desc: "Receive funds in your original payment method within 5-10 days.",
            icon: <CreditCard className="text-purple-600" size={24} />
        }
    ];

    return (
        <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

            {/* Header */}
            <header className={`pt-16 pb-16 px-6 text-center border-b transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-main dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <RotateCcw size={14} />
                        <span>Hassle-Free Returns</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">Refund & Return Policy</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Not happy with your purchase? We've made our return process as simple as possible. Learn about our 7-day guarantee.
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-6">

                {/* Progress Workflow */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold mb-8 text-center uppercase tracking-widest text-slate-400">How it works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="relative text-center group">
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    {step.icon}
                                </div>
                                <h3 className="font-bold mb-2">{step.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-slate-200 dark:bg-slate-700" />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Main Policy Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <PackageCheck className="text-emerald-500" />
                                Return Eligibility
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                                    <div>
                                        <h4 className="font-bold text-sm">Valid Reasons for Return</h4>
                                        <p className="text-sm text-slate-500 mt-1">Damaged items, wrong size/color, missing parts, or if the product significantly differs from the description.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <XCircle className="text-rose-500 shrink-0" size={20} />
                                    <div>
                                        <h4 className="font-bold text-sm">Non-Returnable Items</h4>
                                        <p className="text-sm text-slate-500 mt-1">Perishable goods (food/flowers), custom-made products, personal care items, and software with broken seals.</p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
                                <CreditCard className="text-blue-500" />
                                Refund Methods
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                Once the vendor receives and inspects your return, we will process your refund. Funds will be credited back to your original payment method:
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border rounded-xl">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Credit/Debit Card</span>
                                    <p className="font-bold text-lg">5-7 Days</p>
                                </div>
                                <div className="p-4 border rounded-xl">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Mobile Wallets</span>
                                    <p className="font-bold text-lg">24-48 Hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-200 dark:shadow-none relative overflow-hidden">
                            <ShieldCheck size={80} className="absolute -right-4 -bottom-4 text-emerald-500/30" />
                            <h4 className="text-xl font-bold mb-3 relative z-10">Shopper Protection</h4>
                            <p className="text-sm text-emerald-50 text-opacity-80 mb-6 relative z-10 leading-relaxed">
                                If a vendor refuses a valid return, ShoppersLink will step in to mediate and ensure your refund is processed.
                            </p>
                            <button className="w-full py-3 bg-white text-emerald-600 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-colors relative z-10">
                                Open a Dispute
                            </button>
                        </div>

                        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                <HelpCircle size={18} className="text-blue-500" />
                                Common Questions
                            </h4>
                            <div className="space-y-4">
                                <details className="group">
                                    <summary className="text-sm font-medium cursor-pointer list-none flex items-center justify-between">
                                        Who pays for shipping?
                                        <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <p className="text-xs text-slate-500 mt-2">If the item is faulty, the vendor pays. For "change of mind", the shopper covers shipping costs.</p>
                                </details>
                                <details className="group">
                                    <summary className="text-sm font-medium cursor-pointer list-none flex items-center justify-between">
                                        Can I exchange items?
                                        <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <p className="text-xs text-slate-500 mt-2">Exchanges depend on vendor stock. We recommend returning the original and placing a new order.</p>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support CTA */}
                <section className="mt-6 text-center">
                    <div className={`p-6 rounded-[3rem] border-2 border-dashed ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">Our support team is available 24/7 to help you with your return or refund status.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-bold text-sm">
                                Chat with Support
                            </button>
                            <button className={`px-8 py-3 border rounded-2xl font-bold text-sm ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                                Email Returns Team
                            </button>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default RefundReturnPolicy;