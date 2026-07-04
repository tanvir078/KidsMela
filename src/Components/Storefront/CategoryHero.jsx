import { motion } from 'framer-motion';
import { Link } from '@/lib/inertiaCompat';

export default function CategoryHero({ category }) {
    const { id, name, slug, description, cover_image, seo_title, seo_description } = category;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
                delay: 0.2,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden"
            style={{
                height: '520px',
            }}
        >
            {/* Background Image with Parallax Effect */}
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
            >
                {cover_image ? (
                    <img
                        src={cover_image}
                        alt={name}
                        loading="eager"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-end px-6 pb-12 lg:px-16">
                <div className="mx-auto w-full max-w-7xl">
                    {/* Breadcrumb */}
                    <motion.div
                        variants={contentVariants}
                        className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80"
                    >
                        <Link href="/" className="hover:text-white transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-white">{name}</span>
                    </motion.div>

                    {/* Title and Description */}
                    <motion.div variants={contentVariants}>
                        <h1 className="text-4xl font-black text-white lg:text-6xl">
                            {seo_title || name}
                        </h1>
                        {description && (
                            <p className="mt-4 max-w-2xl text-lg font-medium text-white/90 lg:text-xl">
                                {description}
                            </p>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Responsive Height */}
            <style jsx>{`
                @media (max-width: 1024px) {
                    div[style*="height"] {
                        height: 420px !important;
                    }
                }
                @media (max-width: 640px) {
                    div[style*="height"] {
                        height: 320px !important;
                    }
                }
            `}</style>
        </motion.div>
    );
}
