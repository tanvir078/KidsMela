export default function StarRating({ rating, size = 'sm' }) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    const currentSize = sizeClasses[size] || sizeClasses.sm;

    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <svg key={`full-${i}`} viewBox="0 0 24 24" className={currentSize} fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        );
    }

    if (hasHalfStar) {
        stars.push(
            <svg key="half" viewBox="0 0 24 24" className={currentSize} fill="currentColor" aria-hidden="true">
                <defs>
                    <linearGradient id="half-star">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="#e5e7eb" />
                    </linearGradient>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half-star)" />
            </svg>
        );
    }

    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <svg key={`empty-${i}`} viewBox="0 0 24 24" className={currentSize} fill="#e5e7eb" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        );
    }

    return <div className="flex items-center gap-0.5">{stars}</div>;
}
