import { useState } from 'react';

export default function ImageGallery({ images, mainImage, videoUrl }) {
    const [selectedImage, setSelectedImage] = useState(mainImage);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const allImages = mainImage ? [mainImage, ...(images || [])] : (images || []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    if (allImages.length === 0) {
        return (
            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="grid h-full place-items-center">
                    <div className="text-center">
                        <svg viewBox="0 0 24 24" className="mx-auto h-16 w-16 text-slate-300" fill="none" aria-hidden="true">
                            <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="mt-3 text-sm font-semibold text-slate-400">No image available</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div
                className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-slate-100 cursor-zoom-in lg:rounded-lg"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
            >
                {showVideo && videoUrl ? (
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        className="h-full w-full object-cover"
                    />
                ) : selectedImage ? (
                    <img 
                        src={selectedImage} 
                        alt="Product image" 
                            className={`h-full w-full object-contain transition-transform duration-200 ${
                            isZoomed ? 'scale-150' : 'scale-100'
                        }`}
                        style={{
                            transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
                        }}
                    />
                ) : (
                    <div className="grid h-full place-items-center">
                        <div className="text-center">
                            <svg viewBox="0 0 24 24" className="mx-auto h-16 w-16 text-slate-300" fill="none" aria-hidden="true">
                                <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p className="mt-3 text-sm font-semibold text-slate-400">No image available</p>
                        </div>
                    </div>
                )}
                {isZoomed && !showVideo && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div
                            className="absolute h-16 w-16 rounded-full border-2 border-white/50 bg-white/20"
                            style={{
                                left: `${zoomPosition.x}%`,
                                top: `${zoomPosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    </div>
                )}
                {videoUrl && !showVideo && (
                    <button
                        type="button"
                        onClick={() => setShowVideo(true)}
                        className="absolute inset-0 grid place-items-center bg-black/30 transition-all duration-200 hover:bg-black/40"
                    >
                        <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-3xl shadow-lg">
                            Play
                        </div>
                    </button>
                )}
                {showVideo && (
                    <button
                        type="button"
                        onClick={() => setShowVideo(false)}
                        className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white transition-all duration-200 hover:bg-black/70"
                    >
                        ✕
                    </button>
                )}
            </div>
            
            {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {allImages.map((image, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedImage(image)}
                            className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                                selectedImage === image 
                                    ? 'border-rose-600 ring-2 ring-rose-100' 
                                    : 'border-transparent hover:border-slate-300'
                            }`}
                        >
                            <img 
                                src={image} 
                                alt={`Product image ${index + 1}`} 
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
