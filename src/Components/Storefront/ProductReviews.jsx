import { useState } from 'react';
import StarRating from './StarRating';

export default function ProductReviews({ productId, reviews = [], onAddReview, isModerator = false }) {
    const [isWriting, setIsWriting] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (validFiles.length > 0) {
            const imageUrls = validFiles.map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...imageUrls].slice(0, 3));
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onAddReview) {
            onAddReview({ rating, comment, images });
            setRating(5);
            setComment('');
            setImages([]);
            setIsWriting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-black text-slate-950">Customer Reviews</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
            </div>

            {!isWriting ? (
                <button
                    type="button"
                    onClick={() => setIsWriting(true)}
                    className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
                >
                    Write a Review
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <h3 className="text-base font-black text-slate-950">Write Your Review</h3>
                    <div className="mt-3 space-y-3">
                        <div>
                            <label className="mb-2 block text-xs font-bold text-slate-600">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="text-2xl"
                                    >
                                        {star <= rating ? '⭐' : '☆'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-bold text-slate-600">Your Review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-24 w-full rounded-2xl border-slate-200 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500"
                                placeholder="Share your experience with this product..."
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-bold text-slate-600">Photos (optional, max 3)</label>
                            <div className="flex gap-2">
                                {images.map((img, index) => (
                                    <div key={index} className="relative h-20 w-20">
                                        <img src={img} alt={`Review ${index + 1}`} className="h-full w-full rounded-xl object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-xs font-black text-white"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                {images.length < 3 && (
                                    <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 transition-colors hover:border-orange-500">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <span className="text-2xl text-slate-400">+</span>
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white"
                            >
                                Submit Review
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsWriting(false)}
                                className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {reviews.length === 0 ? (
                <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 text-center shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm font-semibold text-slate-500">No reviews yet. Be the first to review!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {reviews.map((review, index) => (
                        <div key={index} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-xs font-black text-white flex items-center justify-center">
                                        {review.author?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-black text-slate-950">
                                        {review.author || 'Anonymous'}
                                    </span>
                                </div>
                                <StarRating rating={review.rating} size="sm" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-slate-600">{review.comment}</p>
                            {review.images && review.images.length > 0 && (
                                <div className="mt-3 flex gap-2">
                                    {review.images.map((img, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={img}
                                            alt={`Review image ${imgIndex + 1}`}
                                            className="h-16 w-16 rounded-xl object-cover"
                                        />
                                    ))}
                                </div>
                            )}
                            <p className="mt-2 text-xs font-semibold text-slate-400">
                                {review.date || 'Just now'}
                            </p>
                            {isModerator && (
                                <div className="mt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onModerateReview?.(index, 'approve')}
                                        className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-600 transition-all duration-200 hover:bg-emerald-200 active:scale-95"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onModerateReview?.(index, 'reject')}
                                        className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600 transition-all duration-200 hover:bg-red-200 active:scale-95"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                            {review.verified && (
                                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5">
                                    <span className="text-[10px] font-black text-emerald-700">✓ Verified Purchase</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
