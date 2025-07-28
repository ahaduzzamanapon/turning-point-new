import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function PermissionManagement({ auth, permissions }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Permission Management</h2>}
        >
            <Head title="Permission Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <h3 className="text-lg font-medium text-white mb-4">Permissions</h3>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-white bg-black/10 backdrop-blur-xl border-b-4 border-[#8b2022]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Guard Name</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white bg-black/10 backdrop-blur-xl border-b-1 border-[#8b2022]">
                                    {permissions.map((permission) => (
                                        <tr key={permission.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{permission.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{permission.guard_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
