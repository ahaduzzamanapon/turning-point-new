import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const backgroundImageUrl = 'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1951&q=80';

    return (
        <div
            className="relative min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 via-cyan-600/50 to-blue-600/50 dark:from-purple-900/70 dark:via-cyan-900/70 dark:to-blue-900/70"></div>

            <Head title="Log in" />

            <div className="relative w-full max-w-md animate-fadeIn">
                {/* Glassmorphism Form Container */}
                <div className="bg-white/30 dark:bg-gray-800/40 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
                    <div className="p-8">
                        <div className="flex flex-col items-center mb-6">
                            <Link href="/">
                                <img src="/images/logo.png" alt="Logo" className="h-24" />
                            </Link>
                            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
                                Welcome Back!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">Sign in to continue</p>
                        </div>

                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-500 dark:text-green-400">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email" className="text-white dark:text-gray-300 !font-semibold" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full bg-white/40 dark:bg-gray-900/50 border-gray-300/50 dark:border-gray-700/50 focus:ring-indigo-500/50 focus:border-indigo-500/50 rounded-lg shadow-sm"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-white dark:text-gray-300 !font-semibold" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-white/40 dark:bg-gray-900/50 border-gray-300/50 dark:border-gray-700/50 focus:ring-indigo-500/50 focus:border-indigo-500/50 rounded-lg shadow-sm"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                                    <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>

                            <div className="flex flex-col items-center">
                                <PrimaryButton className="w-full justify-center !py-3 !text-base !font-bold" disabled={processing}>
                                    Log In
                                </PrimaryButton>
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    Don't have an account?{' '}
                                    <Link href={route('register')} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}