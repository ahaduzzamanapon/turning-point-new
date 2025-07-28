import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function UserManagement({ auth, users, roles }) {
    const assignRole = (userId, roleId) => {
        Inertia.post(route('admin.users.assignRole'), { userId, roleId });
    };

    const removeRole = (userId, roleId) => {
        Inertia.post(route('admin.users.removeRole'), { userId, roleId });
    };

    const deleteUser = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            Inertia.delete(route('admin.users.destroy', userId));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">User Management</h2>}
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-white">Users</h3>
                                <Link href={route('admin.users.create')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Add User
                                </Link>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-white bg-black/10 backdrop-blur-xl border-b-4 border-[#8b2022]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Roles</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white bg-black/10 backdrop-blur-xl border-b-1 border-[#8b2022]">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.roles.map((role) => (
                                                    <span key={role.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                                        {role.name}
                                                        <button onClick={() => removeRole(user.id, role.id)} className="ml-1 text-blue-500 hover:text-blue-700">x</button>
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select onChange={(e) => assignRole(user.id, e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10">
                                                    <option value="">Assign Role</option>
                                                    {roles.map((role) => (
                                                        <option key={role.id} value={role.id}>{role.name}</option>
                                                    ))}
                                                </select>
                                                <Link href={route('admin.users.edit', user.id)} className="text-indigo-600 hover:text-indigo-900 ml-4">Edit</Link>
                                                <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                                            </td>
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