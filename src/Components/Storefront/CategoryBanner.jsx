import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryBanner({ categoryId = null }) {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const url = categoryId
                    ? `/api/category-banners?category_id=${categoryId}&type=category`
                    : '/api/category-banners?type=category';
                const response = await fetch(url);
                const data = await response.json();
                setBanners(data.data || []);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch banners:', error);
                setLoading(false);
            }
        };

        fetchBanners();
    }, [categoryId]);

    const nextBanner = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevBanner = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (loading) {
        return (
            <div className="h-64 animate-pulse bg-slate-200" />
        );
    }

    if (banners.length === 0) {
        return null;
    }

    const currentBanner = banners[currentIndex];

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600">
            {/* Banner Content */}
            <div className="relative h-64 md:h-80">
                {currentBanner.image_url && (
                    <img
                        src={currentBanner.image_url}
                        alt={currentBanner.title}
                        className="h-full w-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-2xl font-black text-white md:text-3xl">
                        {currentBanner.title}
                    </h2>
                    {currentBanner.description && (
                        <p className="mt-2 text-sm font-semibold text-white/90 md:text-base">
                            {currentBanner.description}
                        </p>
                    )}
                    {currentBanner.discount && (
                        <span className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-sm font-black text-rose-600">
                            {currentBanner.discount}
                        </span>
                    )}
                </div>

                {/* Banner Navigation Arrows */}
                {banners.length > 1 && (
                    <>
                        <button
                            onClick={prevBanner}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/30"
                            aria-label="Previous banner"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={nextBanner}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/30"
                            aria-label="Next banner"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}

                {/* Banner Dots */}
                {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 w-2 rounded-full transition ${
                                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                                aria-label={`Go to banner ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
