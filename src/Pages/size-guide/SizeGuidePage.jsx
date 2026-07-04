import { Head, Link } from '@/lib/inertiaCompat';
import { useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';

const sizeCharts = {
    men: {
        tops: [
            { size: 'S', chest: '36-38', length: '26-27', shoulder: '16-17' },
            { size: 'M', chest: '38-40', length: '27-28', shoulder: '17-18' },
            { size: 'L', chest: '40-42', length: '28-29', shoulder: '18-19' },
            { size: 'XL', chest: '42-44', length: '29-30', shoulder: '19-20' },
            { size: 'XXL', chest: '44-46', length: '30-31', shoulder: '20-21' },
        ],
        bottoms: [
            { size: '28', waist: '28', hips: '34-36', length: '40-41' },
            { size: '30', waist: '30', hips: '36-38', length: '41-42' },
            { size: '32', waist: '32', hips: '38-40', length: '42-43' },
            { size: '34', waist: '34', hips: '40-42', length: '43-44' },
            { size: '36', waist: '36', hips: '42-44', length: '44-45' },
        ]
    },
    women: {
        tops: [
            { size: 'XS', bust: '30-32', waist: '24-26', hips: '32-34' },
            { size: 'S', bust: '32-34', waist: '26-28', hips: '34-36' },
            { size: 'M', bust: '34-36', waist: '28-30', hips: '36-38' },
            { size: 'L', bust: '36-38', waist: '30-32', hips: '38-40' },
            { size: 'XL', bust: '38-40', waist: '32-34', hips: '40-42' },
        ],
        bottoms: [
            { size: '24', waist: '24', hips: '34-35', length: '38-39' },
            { size: '26', waist: '26', hips: '35-36', length: '39-40' },
            { size: '28', waist: '28', hips: '36-37', length: '40-41' },
            { size: '30', waist: '30', hips: '37-38', length: '41-42' },
            { size: '32', waist: '32', hips: '38-39', length: '42-43' },
        ]
    },
    kids: {
        tops: [
            { size: '2-3Y', chest: '20-22', length: '12-13', age: '2-3 years' },
            { size: '4-5Y', chest: '22-24', length: '13-14', age: '4-5 years' },
            { size: '6-7Y', chest: '24-26', length: '14-15', age: '6-7 years' },
            { size: '8-9Y', chest: '26-28', length: '15-16', age: '8-9 years' },
            { size: '10-12Y', chest: '28-30', length: '16-17', age: '10-12 years' },
        ],
        bottoms: [
            { size: '2-3Y', waist: '20-21', hips: '22-23', length: '18-19', age: '2-3 years' },
            { size: '4-5Y', waist: '21-22', hips: '23-24', length: '19-20', age: '4-5 years' },
            { size: '6-7Y', waist: '22-23', hips: '24-25', length: '20-21', age: '6-7 years' },
            { size: '8-9Y', waist: '23-24', hips: '25-26', length: '21-22', age: '8-9 years' },
            { size: '10-12Y', waist: '24-25', hips: '26-27', length: '22-23', age: '10-12 years' },
        ]
    }
};

export default function SizeGuidePage() {
    const [activeCategory, setActiveCategory] = useState('men');
    const [activeType, setActiveType] = useState('tops');

    return (
        <MobileShell title="Size Guide" simpleHeader={true}>
            <Head title="Size Guide" />

            <section className="space-y-4 px-4 py-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                            Shopping Guide
                        </p>
                        <h1 className="mt-2 text-2xl font-black">Size Guide</h1>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                            Find your perfect fit
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="flex gap-2">
                        {['men', 'women', 'kids'].map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => {
                                    setActiveCategory(category);
                                    setActiveType('tops');
                                }}
                                className={`flex-1 rounded-xl px-4 py-3 text-xs font-black transition-all ${
                                    activeCategory === category
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="flex gap-2">
                        {['tops', 'bottoms'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setActiveType(type)}
                                className={`flex-1 rounded-xl px-4 py-3 text-xs font-black transition-all ${
                                    activeType === type
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-black text-slate-700">Size</th>
                                {activeCategory === 'kids' && activeType === 'tops' && (
                                    <th className="px-4 py-3 text-left text-xs font-black text-slate-700">Age</th>
                                )}
                                {activeType === 'tops' ? (
                                    <>
                                        <th className="px-4 py-3 text-left text-xs font-black text-slate-700">Chest (in)</th>
                                        <th className="px-4 py-3 text-left text-xs font-black text-slate-700">Length (in)</th>
                                        {activeCategory !== 'kids' && (
                                            <th className="px-4 py-3 text-left text-xs font-black text-slate-700">Shoulder (in)</th>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <th className="px-4 py-3 text-left text-xs font-black text-slate-700">Waist (in)</th>
                                        <th className="px-4 py-3 text-left text-xs font-black text-slate-700">Hips (in)</th>
                                        <th className="px-4 py-3 text-left text-xs font-black text-slate-700">Length (in)</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {sizeCharts[activeCategory][activeType].map((item, index) => (
                                <tr key={index} className="border-t border-slate-100">
                                    <td className="px-4 py-3 text-sm font-black text-slate-900">{item.size}</td>
                                    {activeCategory === 'kids' && activeType === 'tops' && (
                                        <td className="px-4 py-3 text-sm font-medium text-slate-600">{item.age}</td>
                                    )}
                                    {activeType === 'tops' ? (
                                        <>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-600">{item.chest}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-600">{item.length}</td>
                                            {activeCategory !== 'kids' && (
                                                <td className="px-4 py-3 text-sm font-medium text-slate-600">{item.shoulder}</td>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-600">{item.waist}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-600">{item.hips}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-600">{item.length}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">How to Measure</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">1</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Chest</h3>
                                <p className="mt-1 font-medium text-slate-600">Measure around the fullest part of your chest, keeping the tape level.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">2</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Waist</h3>
                                <p className="mt-1 font-medium text-slate-600">Measure around your natural waistline, typically above your belly button.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                                <span className="text-sm font-black">3</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Length</h3>
                                <p className="mt-1 font-medium text-slate-600">Measure from the highest point of your shoulder to the desired length.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 text-center shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-black text-slate-950">Still unsure?</h2>
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                        Our customer support team is here to help you find the perfect size.
                    </p>
                    <Link href="/contact" className="mt-4 inline-flex rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                        Contact Support
                    </Link>
                </div>
            </section>
        </MobileShell>
    );
}
