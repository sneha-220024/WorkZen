import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard'); // The router will automatically redirect based on their actual role
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="font-sora font-bold text-2xl text-text-primary">Work<span className="text-primary">Zen</span></span>
                </Link>
                <h2 className="text-3xl font-sora font-extrabold text-text-primary">
                    Welcome Back
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
                        Sign up for free
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-card border border-border-color rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-1.5">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-border-color rounded-xl shadow-sm placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-text-primary mb-1.5">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-border-color rounded-xl shadow-sm placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-3">
                                Login As
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('employee')}
                                    className={`py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${role === 'employee'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border-color bg-white text-text-secondary hover:border-text-secondary/30'
                                        }`}
                                >
                                    <span className="text-xl">🏃</span>
                                    <span className="font-bold text-sm">Employee</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('hr')}
                                    className={`py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${role === 'hr'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border-color bg-white text-text-secondary hover:border-text-secondary/30'
                                        }`}
                                >
                                    <span className="text-xl">💼</span>
                                    <span className="font-bold text-sm">HR Manager</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary/20 border-border-color rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-text-secondary">
                                    Remember me
                                </label>
                            </div>

                            <div className="font-medium text-primary hover:text-primary-dark">
                                <a href="#">Forgot your password?</a>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full justify-center py-3 shadow-glow"
                                loading={loading}
                            >
                                Sign in
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border-color"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-text-secondary">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full inline-flex justify-center items-center gap-3 py-3 px-4 border border-border-color rounded-xl shadow-sm bg-white text-sm font-bold text-text-primary hover:bg-background transition-colors active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.67-2.28 1.05-3.71 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
