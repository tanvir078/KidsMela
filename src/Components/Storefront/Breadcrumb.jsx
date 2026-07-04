import { Link } from '@/lib/inertiaCompat';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <nav className="py-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {index > 0 && (
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                        {index === items.length - 1 ? (
                            <span className="font-semibold text-slate-900">{item.label}</span>
                        ) : (
                            <Link
                                href={item.href}
                                className="font-medium text-slate-600 transition-colors hover:text-slate-900"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
