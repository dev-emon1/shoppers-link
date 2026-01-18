'use client';
import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Lock,
    Eye,
    UserCheck,
    Bell,
    Mail,
    ChevronRight,
    ChevronDown,
    Globe,
    FileText,
    Clock,
    ExternalLink
} from 'lucide-react';

const PrivacyPolicy = () => {
    const [activeTab, setActiveTab] = useState('introduction');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const sections = [
        { id: 'introduction', title: 'Introduction', icon: <FileText size={18} /> },
        { id: 'data-collection', title: 'Data We Collect', icon: <Eye size={18} /> },
        { id: 'usage', title: 'How We Use Data', icon: <Globe size={18} /> },
        { id: 'sharing', title: 'Data Sharing', icon: <UserCheck size={18} /> },
        { id: 'security', title: 'Security Measures', icon: <Lock size={18} /> },
        { id: 'rights', title: 'Your Rights', icon: <ShieldCheck size={18} /> },
        { id: 'cookies', title: 'Cookies & Tracking', icon: <Bell size={18} /> },
        { id: 'contact', title: 'Contact Us', icon: <Mail size={18} /> },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveTab(id);
        }
    };

    return (
        <div className={`min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

            {/* Header Section */}
            <header className={`pt-16 pb-16 px-6 text-center border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-main dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <ShieldCheck size={14} />
                        <span>Trust & Safety Center</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        At ShoppersLink, your privacy is our priority. This policy explains how we collect, use, and protect your information across our multivendor platform.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>Last Updated: January 18, 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe size={16} />
                            <span>Applies Globally</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-6 lg:py-6 flex flex-col lg:flex-row gap-12">

                {/* Sticky Sidebar Navigation */}
                <aside className="lg:w-72 shrink-0">
                    <div className="sticky top-24 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Table of Contents</div>
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                  ${activeTab === section.id
                                        ? 'bg-main text-white shadow-lg  dark:shadow-none'
                                        : 'hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-main dark:text-slate-400'}`}
                            >
                                <span className={`${activeTab === section.id ? 'text-white' : 'text-slate-400 group-hover:text-main'}`}>
                                    {section.icon}
                                </span>
                                {section.title}
                                {activeTab === section.id && <ChevronRight size={14} className="ml-auto" />}
                            </button>
                        ))}

                        <div className="mt-8 p-6 rounded-2xl bg-main text-white overflow-hidden relative group">
                            <div className="relative z-10">
                                <h4 className="font-bold mb-2">Have questions?</h4>
                                <p className="text-xs text-indigo-100 mb-4 leading-relaxed">Our legal team is ready to assist you regarding your data rights.</p>
                                <button className="bg-white text-main text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                                    Contact Privacy Team
                                </button>
                            </div>
                            <ShieldCheck className="absolute -right-4 -bottom-4 text-indigo-500/30" size={100} />
                        </div>
                    </div>
                </aside>

                {/* Policy Content */}
                <main className="flex-1 min-w-0">
                    <div className={`p-8 md:p-12 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>

                        <section id="introduction" className="mb-16 scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-main">
                                    <FileText size={20} />
                                </div>
                                1. Introduction
                            </h2>
                            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    Welcome to ShoppersLink. This Privacy Policy describes how ShoppersLink ("we", "us", or "our") collects, uses, and shares your personal information when you use our multivendor e-commerce platform, mobile applications, and related services.
                                </p>
                                <p>
                                    By accessing or using our platform, you agree to the practices described in this policy. If you do not agree with this policy, please do not use our services.
                                </p>
                            </div>
                        </section>

                        <section id="data-collection" className="mb-16 scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-main">
                                    <Eye size={20} />
                                </div>
                                2. Data We Collect
                            </h2>
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <h4 className="font-bold mb-2 flex items-center gap-2">Personal Information</h4>
                                        <p className="text-sm text-slate-500">Name, email address, phone number, and physical shipping address provided during registration or checkout.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <h4 className="font-bold mb-2 flex items-center gap-2">Vendor Information</h4>
                                        <p className="text-sm text-slate-500">Business registration details, tax IDs, and bank account information for sellers on our platform.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <h4 className="font-bold mb-2 flex items-center gap-2">Technical Data</h4>
                                        <p className="text-sm text-slate-500">IP address, browser type, device identifiers, and browsing behavior via cookies and local storage.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <h4 className="font-bold mb-2 flex items-center gap-2">Payment Data</h4>
                                        <p className="text-sm text-slate-500">We do not store credit card details. All payments are processed through secure, PCI-compliant third-party gateways.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="usage" className="mb-16 scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-green-900/30 text-main">
                                    <Globe size={20} />
                                </div>
                                3. How We Use Your Data
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    "To process and fulfill orders across multiple vendors.",
                                    "To facilitate communication between shoppers and sellers.",
                                    "To personalize your shopping experience and product recommendations.",
                                    "To process payouts for vendors and handle platform commissions.",
                                    "To detect and prevent fraudulent transactions or policy violations."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                        <CheckCircle2 size={18} className="text-green mt-1 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section id="security" className="mb-16 scroll-mt-24">
                            <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                                        <Lock size={20} className="text-indigo-400" />
                                        4. Security Measures
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed mb-6">
                                        We implement industry-standard security measures to protect your data. All sensitive information is encrypted via Secure Socket Layer (SSL) technology. Access to personal data is strictly limited to authorized employees and vendors who need the information to fulfill your requests.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold tracking-widest uppercase">SSL Encrypted</span>
                                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold tracking-widest uppercase">PCI-DSS Compliant</span>
                                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold tracking-widest uppercase">2FA Supported</span>
                                    </div>
                                </div>
                                <div className="absolute right-0 top-0 w-64 h-64 bg-main/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            </div>
                        </section>

                        <section id="contact" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600">
                                    <Mail size={20} />
                                </div>
                                5. Contact Us
                            </h2>
                            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact our Data Protection Officer:
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-main font-bold">
                                        <Mail size={18} />
                                        <span>privacy@shopperslink.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <Globe size={18} />
                                        <span>Legal Department, ShoppersLink HQ, Bangladesh.</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </main>
            </div>
        </div>
    );
};

// Helper Components
const CheckCircle2 = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default PrivacyPolicy;