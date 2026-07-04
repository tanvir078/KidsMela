import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const tabs = [
    { id: 'description', label: 'Description', contentKey: 'description' },
    { id: 'fabric', label: 'Fabric', contentKey: 'fabric' },
    { id: 'measurement', label: 'Size Measurement', contentKey: 'measurement' },
    { id: 'delivery', label: 'Delivery Information', contentKey: 'delivery' },
];

export default function ProductTabs({ product }) {
    const [activeTab, setActiveTab] = useState(null);

    const handleTabClick = (tabId) => {
        setActiveTab(activeTab === tabId ? null : tabId);
    };

    const renderContent = (content) => {
        if (!content) return <p className="text-sm text-slate-500">No information available.</p>;
        
        // If content contains HTML, render it dangerously
        if (content.includes('<') && content.includes('>')) {
            return (
                <div 
                    className="prose prose-sm max-w-none text-slate-700"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            );
        }
        
        // Otherwise render as plain text with line breaks
        return (
            <div className="text-sm text-slate-700 whitespace-pre-line">
                {content}
            </div>
        );
    };

    return (
        <div className="py-8">
            <h2 className="mb-6 text-xl font-black text-slate-900">Product Information</h2>
            
            {/* Desktop: 4 Columns */}
            <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`rounded-xl border-2 transition-all ${
                            activeTab === tab.id
                                ? 'border-slate-900 bg-slate-50'
                                : 'border-slate-200 bg-white hover:border-slate-400'
                        }`}
                    >
                        <button
                            onClick={() => handleTabClick(tab.id)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left"
                            aria-expanded={activeTab === tab.id}
                        >
                            <span className="text-sm font-black uppercase tracking-wider text-slate-900">
                                {tab.label}
                            </span>
                            {activeTab === tab.id ? (
                                <ChevronUp className="h-4 w-4 text-slate-900" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                        </button>
                        <AnimatePresence>
                            {activeTab === tab.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4">
                                        {renderContent(product[tab.contentKey])}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Tablet: 2 Columns */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-4 lg:hidden">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`rounded-xl border-2 transition-all ${
                            activeTab === tab.id
                                ? 'border-slate-900 bg-slate-50'
                                : 'border-slate-200 bg-white hover:border-slate-400'
                        }`}
                    >
                        <button
                            onClick={() => handleTabClick(tab.id)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left"
                            aria-expanded={activeTab === tab.id}
                        >
                            <span className="text-sm font-black uppercase tracking-wider text-slate-900">
                                {tab.label}
                            </span>
                            {activeTab === tab.id ? (
                                <ChevronUp className="h-4 w-4 text-slate-900" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                        </button>
                        <AnimatePresence>
                            {activeTab === tab.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4">
                                        {renderContent(product[tab.contentKey])}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Mobile: Vertical Accordion */}
            <div className="space-y-3 md:hidden">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`rounded-xl border-2 transition-all ${
                            activeTab === tab.id
                                ? 'border-slate-900 bg-slate-50'
                                : 'border-slate-200 bg-white'
                        }`}
                    >
                        <button
                            onClick={() => handleTabClick(tab.id)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left"
                            aria-expanded={activeTab === tab.id}
                        >
                            <span className="text-sm font-black uppercase tracking-wider text-slate-900">
                                {tab.label}
                            </span>
                            {activeTab === tab.id ? (
                                <ChevronUp className="h-4 w-4 text-slate-900" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                        </button>
                        <AnimatePresence>
                            {activeTab === tab.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4">
                                        {renderContent(product[tab.contentKey])}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
