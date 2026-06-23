import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/Contexts/AuthContext';
import { authApi } from '@/lib/authApi';

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const provider = searchParams.get('provider');
            const code = searchParams.get('code');
            
            if (!provider || !code) {
                setError('Invalid OAuth callback');
                setIsLoading(false);
                return;
            }

            try {
                // For now, we'll redirect to the backend callback endpoint
                // In a real implementation, you might need to handle this differently
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
                window.location.href = `${API_BASE_URL}/auth/${provider}/callback?code=${code}`;
            } catch (err) {
                setError(err.message || 'Authentication failed');
                setIsLoading(false);
            }
        };

        handleCallback();
    }, [searchParams]);

    if (error) {
        return (
            <div className="grid min-h-screen place-items-center px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-black text-red-600">Authentication Failed</h1>
                    <p className="mt-4 text-sm font-semibold text-slate-600">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-6 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid min-h-screen place-items-center px-6">
            <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600" />
                <p className="mt-4 text-sm font-semibold text-slate-600">Completing authentication...</p>
            </div>
        </div>
    );
}
