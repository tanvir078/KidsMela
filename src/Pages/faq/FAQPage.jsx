import { Head, Link } from '@/lib/inertiaCompat';
import { useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { Button, Card } from '@/Components/UI';

const faqs = [
    {
        category: 'Ordering & Payment',
        questions: [
            {
                q: 'How do I place an order?',
                a: 'Simply browse our products, select your preferred size and color, add to cart, and proceed to checkout. You can pay via cash on delivery or online payment methods.'
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept cash on delivery (COD), bKash, Nagad, credit/debit cards, and other popular payment methods in Bangladesh.'
            },
            {
                q: 'Is my payment information secure?',
                a: 'Yes, we use industry-standard encryption and security measures to protect your payment information. Your transactions are completely safe with us.'
            }
        ]
    },
    {
        category: 'Shipping & Delivery',
        questions: [
            {
                q: 'How long does delivery take?',
                a: 'Delivery in Dhaka takes 1-2 business days. Outside Dhaka takes 3-5 business days. Express delivery is available for select areas.'
            },
            {
                q: 'What are the shipping charges?',
                a: 'Standard delivery: 60 BDT. Express delivery: 120 BDT. Free shipping on orders above 1000 BDT. Store pickup is free.'
            },
            {
                q: 'Can I track my order?',
                a: 'Yes! You can track your order through our website or app using your order number. You\'ll also receive SMS updates on your order status.'
            }
        ]
    },
    {
        category: 'Returns & Exchanges',
        questions: [
            {
                q: 'What is your return policy?',
                a: 'We accept returns within 7 days of delivery for unused items in original condition. Items must have tags attached and original packaging.'
            },
            {
                q: 'How do I request a return or exchange?',
                a: 'Go to your order details page and click on "Request Return/Exchange". Fill in the reason and preferred resolution. Our team will process your request within 24-48 hours.'
            },
            {
                q: 'Who pays for return shipping?',
                a: 'If the return is due to our error (wrong item, defective product), we cover return shipping. For change of mind returns, customer pays return shipping.'
            }
        ]
    },
    {
        category: 'Product Information',
        questions: [
            {
                q: 'How do I know my size?',
                a: 'We provide detailed size charts for each product. You can also refer to our Size Guide page for general measurements. If unsure, our customer support can help.'
            },
            {
                q: 'Are the products authentic?',
                a: 'Absolutely! All products sold at Kids Mela are 100% authentic and sourced directly from manufacturers or authorized distributors.'
            },
            {
                q: 'Do you offer gift wrapping?',
                a: 'Yes, we offer gift wrapping services for a small additional fee. You can select this option during checkout.'
            }
        ]
    },
    {
        category: 'Account & Support',
        questions: [
            {
                q: 'Do I need an account to shop?',
                a: 'No, you can shop as a guest. However, creating an account gives you benefits like order tracking, wishlist, faster checkout, and exclusive offers.'
            },
            {
                q: 'How do I reset my password?',
                a: 'Click on "Forgot Password" on the login page. Enter your email or phone number, and we\'ll send you a reset link or OTP.'
            },
            {
                q: 'How can I contact customer support?',
                a: 'You can reach us via phone, email, or live chat. Our support team is available Saturday-Thursday 10AM-9PM and Friday 3PM-9PM.'
            }
        ]
    }
];

export default function FAQPage() {
    const [expandedCategory, setExpandedCategory] = useState('Ordering & Payment');
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    return (
        <MobileShell title="FAQ" simpleHeader={true}>
            <Head title="FAQ" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-rose-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            Help Center
                        </p>
                        <h1 className="mt-2 text-2xl font-black">Frequently Asked Questions</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Find answers to common questions
                        </p>
                    </div>
                </div>

                <Card padding="p-4" className="shadow-md">
                    <div className="flex flex-wrap gap-2">
                        {faqs.map((faq) => (
                            <button
                                key={faq.category}
                                type="button"
                                onClick={() => {
                                    setExpandedCategory(faq.category);
                                    setExpandedQuestion(null);
                                }}
                                className={`rounded-full px-4 py-2 text-xs font-black transition-all ${
                                    expandedCategory === faq.category
                                        ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {faq.category}
                            </button>
                        ))}
                    </div>
                </Card>

                <div className="space-y-3">
                    {faqs
                        .find((faq) => faq.category === expandedCategory)
                        ?.questions.map((item, index) => (
                            <Card key={index} padding="p-4" className="shadow-md hoverable">
                                <button
                                    type="button"
                                    onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                                    className="flex w-full items-center justify-between text-left"
                                >
                                    <span className="flex-1 text-sm font-bold text-slate-900">{item.q}</span>
                                    <div className={`ml-3 transition-transform ${expandedQuestion === index ? 'rotate-180' : ''}`}>
                                        <svg viewBox="0 0 20 20" className="h-5 w-5 text-slate-500" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                </button>
                                {expandedQuestion === index && (
                                    <div className="mt-3 pt-3 border-t border-slate-100">
                                        <p className="text-sm font-medium text-slate-600">{item.a}</p>
                                    </div>
                                )}
                            </Card>
                        ))}
                </div>

                <Card padding="p-5" className="bg-gradient-to-br from-slate-50 to-slate-100 shadow-md text-center">
                    <h2 className="text-lg font-black text-slate-950">Still have questions?</h2>
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                        Can't find the answer you're looking for? Please reach out to our support team.
                    </p>
                    <Link href="/contact">
                        <Button className="mt-4">Contact Support</Button>
                    </Link>
                </Card>
            </section>
        </MobileShell>
    );
}
