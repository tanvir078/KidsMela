import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductMedia({ product }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [showVideo, setShowVideo] = useState(false);
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    // Build media array: main image + gallery + video
    const mediaItems = [
        { type: 'image', src: product.display_image_url || product.image_url },
        ...(product.gallery || []).map(src => ({ type: 'image', src })),
        ...(product.video ? [{ type: 'video', src: product.video }] : []),
    ];

    const currentMedia = mediaItems[currentImageIndex];
    const hasMultipleImages = mediaItems.length > 1;

    // Preload first two images
    useEffect(() => {
        mediaItems.slice(0, 2).forEach((item, index) => {
            if (item.type === 'image') {
                const img = new Image();
                img.src = item.src;
            }
        });
    }, [mediaItems]);

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
        setShowVideo(false);
    };

    const handlePrevious = () => {
        setCurrentImageIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
        setShowVideo(false);
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % mediaItems.length);
        setShowVideo(false);
    };

    const handleMouseMove = (e) => {
        if (!isZoomed || !imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => setIsZoomed(true);
    const handleMouseLeave = () => setIsZoomed(false);

    // Touch swipe support
    const touchStartX = useRef(0);
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrevious();
            }
        }
    };

    return (
        <div className="space-y-4" ref={containerRef}>
            {/* Main Media Display */}
            <div
                className="relative aspect-square overflow-hidden bg-slate-100 rounded-2xl"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <AnimatePresence mode="wait">
                    {currentMedia.type === 'image' ? (
                        <motion.img
                            key={currentMedia.src}
                            ref={imageRef}
                            src={currentMedia.src}
                            alt={product.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            loading="lazy"
                            className={`h-full w-full object-cover transition-transform duration-300 ${
                                isZoomed ? 'scale-150' : 'scale-100'
                            }`}
                            style={{
                                transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
                            }}
                        />
                    ) : (
                        <motion.div
                            key={currentMedia.src}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="h-full w-full flex items-center justify-center bg-slate-900"
                        >
                            {showVideo ? (
                                <video
                                    src={currentMedia.src}
                                    controls
                                    autoPlay
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <button
                                    onClick={() => setShowVideo(true)}
                                    className="flex flex-col items-center gap-3 text-white"
                                >
                                    <div className="grid h-16 w-16 place-items-center rounded-full bg-white/20 backdrop-blur-sm">
                                        <Play className="h-8 w-8 fill-white" />
                                    </div>
                                    <span className="text-sm font-semibold">Play Video</span>
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Zoom Indicator */}
                {currentMedia.type === 'image' && (
                    <div className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/80 backdrop-blur-sm text-slate-700 shadow-lg">
                        <ZoomIn className="h-5 w-5" />
                    </div>
                )}

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/80 backdrop-blur-sm text-slate-700 shadow-lg transition-all hover:bg-white hover:scale-110"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/80 backdrop-blur-sm text-slate-700 shadow-lg transition-all hover:bg-white hover:scale-110"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                        {currentImageIndex + 1} / {mediaItems.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {mediaItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative shrink-0 aspect-square w-20 rounded-xl overflow-hidden border-2 transition-all ${
                                index === currentImageIndex
                                    ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2'
                                    : 'border-slate-200 hover:border-slate-400'
                            }`}
                            aria-label={`View ${item.type === 'video' ? 'video' : 'image'} ${index + 1}`}
                        >
                            {item.type === 'image' ? (
                                <img
                                    src={item.src}
                                    alt={`Thumbnail ${index + 1}`}
                                    loading={index < 2 ? 'eager' : 'lazy'}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-900">
                                    <Play className="h-6 w-6 fill-white" />
                                </div>
                            )}
                            {index === currentImageIndex && (
                                <div className="absolute inset-0 ring-2 ring-slate-900 ring-inset" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
