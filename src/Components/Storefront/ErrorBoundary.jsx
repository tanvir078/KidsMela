import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
                        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-100">
                            <svg viewBox="0 0 24 24" className="h-10 w-10 text-red-600" fill="none" aria-hidden="true">
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="mt-4 text-center text-xl font-black text-slate-950">Something went wrong</h2>
                        <p className="mt-2 text-center text-sm font-semibold text-slate-500">
                            An unexpected error occurred. Please refresh the page or try again later.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-6 w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white transition-all duration-200 hover:bg-orange-700 active:scale-95"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
