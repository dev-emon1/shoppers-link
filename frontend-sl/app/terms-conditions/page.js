'use client';
import React, { useState } from 'react';
import {
    Gavel,
    UserPlus,
    ShoppingCart,
    AlertTriangle,
    Scale,
    Ban,
    Truck,
    CreditCard,
    ChevronRight,
    Clock,
    Info,
    CheckCircle2,
    FileText,
    Mail
} from 'lucide-react';

const TermsAndConditions = () => {
    const [activeTab, setActiveTab] = useState('agreement');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const sections = [
        { id: 'agreement', title: 'User Agreement', icon: <UserPlus size={18} /> },
        { id: 'accounts', title: 'Account Registration', icon: <FileText size={18} /> },
        { id: 'marketplace', title: 'Marketplace Rules', icon: <ShoppingCart size={18} /> },
        { id: 'payments', title: 'Payments & Payouts', icon: <CreditCard size={18} /> },
        { id: 'shipping', title: 'Shipping & Returns', icon: <Truck size={18} /> },
        { id: 'conduct', title: 'Prohibited Conduct', icon: <Ban size={18} /> },
        { id: 'liability', title: 'Limitation of Liability', icon: <Scale size={18} /> },
        { id: 'termination', title: 'Account Termination', icon: <AlertTriangle size={18} /> },
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
        <div className={`min-h-screen font-sans selection:bg-amber-100 selection:text-amber-900 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

            {/* Hero Header */}
            <header className={`pt-16 pb-16 px-6 text-center border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <Gavel size={14} />
                        <span>Legal Framework</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">Terms & Conditions</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        These terms govern your use of the ShoppersLink platform. By using our service, you agree to follow these rules. Please read them carefully.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>Effective Date: Jan 18, 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info size={16} />
                            <span>Version 2.4.0</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 lg:py-8 flex flex-col lg:flex-row gap-12">

                {/* Navigation Sidebar */}
                <aside className="lg:w-72 shrink-0">
                    <div className="sticky top-24 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Legal Sections</div>
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                  ${activeTab === section.id
                                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-200 dark:shadow-none'
                                        : 'hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 dark:text-slate-400'}`}
                            >
                                <span className={`${activeTab === section.id ? 'text-white' : 'text-slate-400 group-hover:text-amber-500'}`}>
                                    {section.icon}
                                </span>
                                {section.title}
                            </button>
                        ))}

                        <div className="mt-8 p-6 rounded-2xl bg-slate-800 text-white relative overflow-hidden">
                            <p className="text-xs text-slate-300 mb-4 font-medium leading-relaxed italic">
                                "Transparency and fairness are the foundation of our marketplace ecosystem."
                            </p>
                            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                                <Scale size={14} />
                                <span>Compliance Verified</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    <div className={`p-8 md:p-12 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>

                        {/* Section 1: Agreement */}
                        <section id="agreement" className="mb-16 scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600">
                                    <UserPlus size={20} />
                                </div>
                                1. Acceptance of Agreement
                            </h2>
                            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
                                <p>
                                    By creating an account, browsing the website, or making a purchase on ShoppersLink, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.
                                </p>
                                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border-l-4 border-amber-500 text-amber-800 dark:text-amber-400 text-sm italic">
                                    If you do not agree to these terms, you must immediately cease all use of the platform and its services.
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Account Registration */}
                        <section id="accounts" className="mb-16 scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                                    <FileText size={20} />
                                </div>
                                2. User Account Registration
                            </h2>
                            <div className="space-y-4 text-slate-600 dark:text-slate-400">
                                <p>To access certain features of the platform, you must register for an account. You agree to:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        "Provide accurate, current info",
                                        "Maintain password security",
                                        "Accept responsibility for actions",
                                        "Verify identity when requested"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium border border-slate-100 dark:border-slate-700">
                                            <CheckCircle2 size={14} className="text-green-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Section 3: Marketplace Rules */}
                        <section id="marketplace" className="mb-16 scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                                    <ShoppingCart size={20} />
                                </div>
                                3. Multivendor Marketplace Rules
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                ShoppersLink acts as an intermediary marketplace. Contracts for sale are directly between the **Shopper** and the **Vendor**.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-indigo-600">For Shoppers</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Orders may contain items from multiple vendors, resulting in separate shipping packages and individual delivery timelines.</p>
                                </div>
                                <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-emerald-600">For Vendors</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Vendors must provide accurate product descriptions, maintain inventory levels, and ship orders within the promised timeframe.</p>
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Payments */}
                        <section id="payments" className="mb-16 scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600">
                                    <CreditCard size={20} />
                                </div>
                                4. Payments & Financial Terms
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl">
                                    <h5 className="font-bold mb-4 text-sm uppercase tracking-wider">Transaction Workflow:</h5>
                                    <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-slate-400 mb-1">Step 1</div>
                                            <p className="text-sm">Payment received by platform escrow</p>
                                        </div>
                                        <ChevronRight className="rotate-90 md:rotate-0 text-slate-300" />
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-slate-400 mb-1">Step 2</div>
                                            <p className="text-sm">Order fulfilled by individual vendors</p>
                                        </div>
                                        <ChevronRight className="rotate-90 md:rotate-0 text-slate-300" />
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-slate-400 mb-1">Step 3</div>
                                            <p className="text-sm">Funds released to vendor wallets</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 5: Conduct */}
                        <section id="conduct" className="mb-16 scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600">
                                    <Ban size={20} />
                                </div>
                                5. Prohibited Conduct
                            </h2>
                            <div className="p-6 rounded-2xl bg-red-50/30 dark:bg-red-900/5 border border-red-100 dark:border-red-900/30">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Users are strictly prohibited from:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    {[
                                        "Posting fraudulent listings",
                                        "Using fake payment methods",
                                        "Harassing other users",
                                        "Circumventing platform fees",
                                        "Scraping platform data",
                                        "Selling illegal substances"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-red-700 dark:text-red-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Contact Footer */}
                        <section id="termination" className="scroll-mt-24 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h4 className="font-bold mb-1">Need legal clarification?</h4>
                                    <p className="text-sm text-slate-500">Our compliance team is available Mon-Fri.</p>
                                </div>
                                <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                                    <Mail size={18} />
                                    legal@shopperslink.com
                                </button>
                            </div>
                        </section>

                    </div>
                </main>
            </div>

        </div>
    );
};

export default TermsAndConditions;