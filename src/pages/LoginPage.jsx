import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, Wind, Droplets, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in with Google.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
            {/* Background Animations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 animate-float-slow opacity-20">
                    <Leaf size={120} className="text-green-400" />
                </div>
                <div className="absolute bottom-1/3 right-1/4 animate-float-delayed opacity-20">
                    <Wind size={100} className="text-emerald-300" />
                </div>
                <div className="absolute top-1/3 right-1/3 animate-pulse-slow opacity-10">
                    <div className="w-64 h-64 bg-green-500 rounded-full blur-[100px]"></div>
                </div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-green-900/50 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-4 border border-green-500/30">
                        <Leaf size={32} className="text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">EcoRoute</h1>
                    <p className="text-gray-300 text-lg font-light">Navigate the planet responsibly.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full group relative flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                    >
                        {/* Button Glow Effect */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer"></div>

                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        {loading ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        By continuing, you agree to our <a href="#" className="text-green-400 hover:underline">Terms</a> and <a href="#" className="text-green-400 hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 text-center w-full text-gray-500 text-xs">
                © 2024 EcoRoute. All rights reserved.
            </div>
        </div>
    );
};

export default LoginPage;
