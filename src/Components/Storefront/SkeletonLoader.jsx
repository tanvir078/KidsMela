export default function SkeletonLoader({ type = 'card', count = 1 }) {
    if (type === 'card') {
        return (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="aspect-square bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 animate-pulse" />
                        <div className="space-y-2 p-2.5">
                            <div className="h-10 rounded-md bg-slate-100 animate-pulse" />
                            <div className="flex items-center justify-between gap-2">
                                <div className="h-5 w-16 rounded-md bg-slate-100 animate-pulse" />
                                <div className="h-4 w-12 rounded-md bg-slate-100 animate-pulse" />
                            </div>
                            <div className="h-3 w-20 rounded-md bg-slate-100 animate-pulse" />
                        </div>
                        <div className="px-2.5 pb-2.5">
                            <div className="h-9 w-full rounded-md bg-slate-100 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'list') {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                        <div className="h-24 w-24 shrink-0 rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 animate-pulse" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-10 w-full rounded-md bg-slate-100 animate-pulse" />
                            <div className="h-4 w-20 rounded-md bg-slate-100 animate-pulse" />
                            <div className="h-6 w-16 rounded-md bg-slate-100 animate-pulse" />
                            <div className="flex items-center justify-between gap-2">
                                <div className="h-9 w-24 rounded-xl bg-slate-100 animate-pulse" />
                                <div className="h-8 w-16 rounded-xl bg-slate-100 animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'hero') {
        return (
            <div className="h-[520px] rounded-3xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 animate-pulse" />
        );
    }

    return (
        <div className="h-72 rounded-3xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 animate-pulse" />
    );
}
