import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <h3 className="text-lg font-medium text-white mb-4">Admin Panel</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route('admin.users')} className="text-blue-600 hover:text-blue-900">
                                        Manage Users
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('admin.roles')} className="text-blue-600 hover:text-blue-900">
                                        Manage Roles
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('admin.permissions')} className="text-blue-600 hover:text-blue-900">
                                        Manage Permissions
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
