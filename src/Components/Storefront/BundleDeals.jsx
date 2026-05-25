import { useState } from 'react';
import { useCart } from '@/Contexts/CartContext';
import ProductCard from './ProductCard';

const BUNDLES = [
    {
        id: 1,
        name: 'Summer Essentials Bundle',
        description: 'Get 3 products for the price of 2!',
        discount: 33,
        products: [1, 2, 3],
        originalPrice: 89.97,
        bundlePrice: 59.99,
    },
    {
        id: 2,
        name: 'Winter Comfort Bundle',
        description: 'Cozy up with our winter collection',
        discount: 25,
        products: [4, 5],
        originalPrice: 79.98,
        bundlePrice: 59.99,
    },
];

export default function BundleDeals({ products = [] }) {
    const { addItem } = useCart();
    const [selectedBundle, setSelectedBundle] = useState(null);

    const handleAddBundle = (bundle) => {
        const bundleProducts = products.filter(p => bundle.products.includes(p.id));
        bundleProducts.forEach(product => {
            addItem(product, 1);
        });
        setSelectedBundle(bundle.id);
        setTimeout(() => setSelectedBundle(null), 2000);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-950">Bundle Deals</h2>
            <div className="space-y-3">
                {BUNDLES.map((bundle) => {
                    const bundleProducts = products.filter(p => bundle.products.includes(p.id));
                    const hasAllProducts = bundleProducts.length === bundle.products.length;

                    return (
                        <div key={bundle.id} className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 shadow-sm ring-1 ring-purple-200">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-black text-slate-950">{bundle.name}</h3>
                                        <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-black text-white">
                                            -{bundle.discount}%
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs font-semibold text-slate-600">{bundle.description}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-400 line-through">${bundle.originalPrice}</span>
                                        <span className="text-lg font-black text-purple-600">${bundle.bundlePrice}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleAddBundle(bundle)}
                                    disabled={!hasAllProducts || selectedBundle === bundle.id}
                                    className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-black transition-all duration-200 active:scale-95 ${
                                        selectedBundle === bundle.id
                                            ? 'bg-emerald-600 text-white'
                                            : hasAllProducts
                                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    {selectedBundle === bundle.id ? 'Added!' : 'Add Bundle'}
                                </button>
                            </div>
                            {hasAllProducts && (
                                <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {bundleProducts.map((product) => (
                                        <div key={product.id} className="shrink-0 h-16 w-16 rounded-xl overflow-hidden ring-1 ring-purple-200">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="grid h-full w-full place-items-center bg-slate-100 text-xs font-bold text-slate-400">No img</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
