import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, usePage } from '@/lib/inertiaCompat';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SubmenuSlider({ submenus, activeSubmenu, onSubmenuChange }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const { url } = usePage();

    useEffect(() => {
        const checkScroll = () => {
            if (scrollRef.current) {
                setCanScrollLeft(scrollRef.current.scrollLeft > 0);
                setCanScrollRight(
                    scrollRef.current.scrollLeft <
                    scrollRef.current.scrollWidth - scrollRef.current.clientWidth
                );
            }
        };

        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [submenus]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.scrollLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - startX;
        scrollRef.current.scrollLeft = x;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleSubmenuClick = (submenu) => {
        onSubmenuChange?.(submenu);
    };

    // Flatten submenus for display (max 2 levels)
    const flattenedSubmenus = submenus?.flatMap(submenu => [
        submenu,
        ...submenu.children
    ]) || [];

    if (!flattenedSubmenus || flattenedSubmenus.length === 0) {
        return null;
    }

    return (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="relative flex items-center gap-4 py-4">
                    {/* Scroll Left Button */}
                    <AnimatePresence>
                        {canScrollLeft && (
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onClick={() => scroll('left')}
                                className="hidden lg:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-md transition-all hover:bg-slate-200 hover:scale-110"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Submenu Slider */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-x-auto scrollbar-hide"
                        style={{
                            cursor: isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none',
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="flex gap-3">
                            {/* All Option */}
                            <Link
                                href={url}
                                onClick={() => handleSubmenuClick(null)}
                                className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                                    !activeSubmenu
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                All
                            </Link>

                            {/* Submenu Items */}
                            {flattenedSubmenus.map((submenu) => (
                                <Link
                                    key={submenu.id}
                                    href={`${url}?submenu=${submenu.slug}`}
                                    onClick={() => handleSubmenuClick(submenu)}
                                    className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                                        activeSubmenu?.id === submenu.id
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {submenu.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Scroll Right Button */}
                    <AnimatePresence>
                        {canScrollRight && (
                            <motion.button
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onClick={() => scroll('right')}
                                className="hidden lg:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-md transition-all hover:bg-slate-200 hover:scale-110"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

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
