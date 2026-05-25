import { useState } from 'react';
import StarRating from './StarRating';

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'S',
        rating: 5,
        text: 'Amazing quality products! The delivery was super fast and the customer service is excellent. Will definitely shop again!',
        date: '2 days ago',
    },
    {
        id: 2,
        name: 'Michael Chen',
        avatar: 'M',
        rating: 5,
        text: 'Best online shopping experience I have ever had. The product quality exceeded my expectations. Highly recommended!',
        date: '1 week ago',
    },
    {
        id: 3,
        name: 'Emily Davis',
        avatar: 'E',
        rating: 4,
        text: 'Great selection of products at reasonable prices. The website is easy to navigate and checkout was smooth.',
        date: '2 weeks ago',
    },
    {
        id: 4,
        name: 'James Wilson',
        avatar: 'J',
        rating: 5,
        text: 'I have been a loyal customer for over a year now. The quality and service are consistently excellent!',
        date: '3 weeks ago',
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const current = TESTIMONIALS[currentIndex];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-950">What Our Customers Say</h2>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={prevTestimonial}
                        className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        onClick={nextTestimonial}
                        className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100 p-5 shadow-sm ring-1 ring-amber-200">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-lg font-black text-white flex items-center justify-center">
                        {current.avatar}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-black text-slate-950">{current.name}</p>
                            <StarRating rating={current.rating} size="sm" />
                        </div>
                        <p className="mt-2 text-sm font-medium text-slate-700 leading-relaxed">"{current.text}"</p>
                        <p className="mt-2 text-xs font-semibold text-slate-500">{current.date}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-2">
                {TESTIMONIALS.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 w-2 rounded-full transition-all duration-200 ${
                            index === currentIndex ? 'w-6 bg-orange-600' : 'bg-slate-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
