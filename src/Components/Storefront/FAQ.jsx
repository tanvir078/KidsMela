import { useState } from 'react';

const FAQS = [
    {
        id: 1,
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 3-5 business days. Express delivery is available for 1-2 business days. You can track your order in real-time using the tracking link sent to your email.',
    },
    {
        id: 2,
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for all unused items in their original packaging. Simply contact our customer service team to initiate a return. Refunds are processed within 5-7 business days.',
    },
    {
        id: 3,
        question: 'Do you offer international shipping?',
        answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Customs fees may apply depending on your location.',
    },
    {
        id: 4,
        question: 'How can I track my order?',
        answer: 'Once your order is shipped, you will receive a tracking number via email. You can also track your order from the Orders section in your account or use the Track Order link on our website.',
    },
    {
        id: 5,
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are securely processed.',
    },
];

export default function FAQ() {
    const [openId, setOpenId] = useState(null);

    const toggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-950">Frequently Asked Questions</h2>
            <div className="space-y-3">
                {FAQS.map((faq) => (
                    <div key={faq.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggle(faq.id)}
                            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                        >
                            <span className="flex-1 text-sm font-black text-slate-950">{faq.question}</span>
                            <span className={`text-xl transition-transform duration-200 ${openId === faq.id ? 'rotate-180' : ''}`}>
                                {openId === faq.id ? '−' : '+'}
                            </span>
                        </button>
                        {openId === faq.id && (
                            <div className="px-4 pb-3">
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
