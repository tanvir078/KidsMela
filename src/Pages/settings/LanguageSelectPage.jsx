import { Head, Link } from '@/lib/inertiaCompat';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function LanguageSelectPage() {
    const { language, changeLanguage, availableLanguages } = useLanguage();

    return (
        <MobileShell title="Display Language" showSearch={false}>
            <Head title="Display Language" />
            <section className="px-4 py-4 pb-8">
                {/* Header */}
                <div className="mb-5 flex items-center gap-3">
                    <Link href="/account" className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 transition-all hover:bg-slate-200 active:scale-95">
                        <svg viewBox="0 0 20 20" className="h-5 w-5 text-slate-600" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"/></svg>
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-slate-900">Display Language</h1>
                        <p className="text-xs font-medium text-slate-400">Choose your preferred language</p>
                    </div>
                </div>

                {/* Language Options */}
                <div className="space-y-2">
                    {Object.entries(availableLanguages).map(([code, lang]) => (
                        <button
                            key={code}
                            type="button"
                            onClick={() => changeLanguage(code)}
                            className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-200 active:scale-[0.98] ${
                                language === code
                                    ? 'bg-orange-50 ring-2 ring-orange-500'
                                    : 'bg-white ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300'
                            }`}
                        >
                            <span className="text-3xl">{lang.flag}</span>
                            <div className="flex-1 text-left">
                                <p className={`text-base font-bold ${language === code ? 'text-orange-700' : 'text-slate-800'}`}>{lang.label}</p>
                                <p className="text-xs font-medium text-slate-400">{lang.nativeName || lang.label}</p>
                            </div>
                            {language === code ? (
                                <div className="grid h-7 w-7 place-items-center rounded-full bg-orange-600">
                                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-white" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                </div>
                            ) : (
                                <div className="h-7 w-7 rounded-full ring-2 ring-slate-200" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Info */}
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                    <div className="flex items-start gap-3">
                        <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                        <p className="text-xs font-medium leading-5 text-slate-500">
                            Your language preference is saved automatically and will persist across sessions.
                        </p>
                    </div>
                </div>
            </section>
        </MobileShell>
    );
}
