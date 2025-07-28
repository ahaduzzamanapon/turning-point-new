import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import RoleForm from './RoleForm';

export default function CreateRole({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.roles.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Create Role</h2>}
        >
            <Head title="Create Role" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <h3 className="text-lg font-medium text-white mb-4">Create New Role</h3>
                            <form onSubmit={handleSubmit}>
                                <RoleForm data={data} setData={setData} errors={errors} />
                                <div className="mt-4">
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={processing}>
                                        Create Role
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
