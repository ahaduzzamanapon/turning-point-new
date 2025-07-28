import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function RoleManagement({ auth, roles, permissions }) {
    const [rolePermissions, setRolePermissions] = useState(() => {
        const initialPermissions = {};
        roles.forEach(role => {
            initialPermissions[role.id] = role.permissions.map(p => p.id);
        });
        return initialPermissions;
    });

    const handlePermissionChange = (roleId, permissionId) => {
        setRolePermissions(prev => {
            const currentPermissions = prev[roleId] || [];
            if (currentPermissions.includes(permissionId)) {
                return {
                    ...prev,
                    [roleId]: currentPermissions.filter(id => id !== permissionId)
                };
            } else {
                return {
                    ...prev,
                    [roleId]: [...currentPermissions, permissionId]
                };
            }
        });
    };

    const saveRolePermissions = (roleId) => {
        console.log('Sending syncPermissions request:', { roleId, permissions: rolePermissions[roleId] || [] });
        Inertia.post(route('admin.roles.syncPermissions'), {
            roleId,
            permissions: rolePermissions[roleId] || []
        }, {
            onSuccess: () => {
                // Optionally, show a success message or refresh the page
                Inertia.reload({ only: ['roles'] });
            },
            onError: (errors) => {
                console.error('Error saving permissions:', errors);
                // Handle errors, e.g., display them to the user
            }
        });
    };

    const deleteRole = (role) => {
        if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            Inertia.delete(route('admin.roles.destroy', role.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Role Management</h2>}
        >
            <Head title="Role Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-white">Roles</h3>
                                <Link href={route('admin.roles.create')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Add Role
                                </Link>
                            </div>
                            <div className="space-y-6">
                                {roles.map((role) => (
                                    <div key={role.id} className="border p-4 rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-lg font-semibold">{role.name}</h4>
                                            <div className="space-x-2">
                                                <Link href={route('admin.roles.edit', role.id)} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                                <button onClick={() => deleteRole(role)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {permissions.map((permission) => (
                                                <label key={permission.id} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={(rolePermissions[role.id] || []).includes(permission.id)}
                                                        onChange={() => handlePermissionChange(role.id, permission.id)}
                                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm text-white">{permission.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="mt-4 text-right">
                                            <button
                                                onClick={() => saveRolePermissions(role.id)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Save Permissions
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
