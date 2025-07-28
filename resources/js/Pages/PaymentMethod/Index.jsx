import React from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ data }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">PaymentMethod</h2>}
        >
            <Head title="PaymentMethod" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="font-semibold text-xl text-white leading-tight">PaymentMethod</h2>
                                {auth.user.permissions.includes('paymentmethods_create') && (
                                    <Link href={route('paymentmethods.create')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Create
                                    </Link>
                                )}
                            </div>
                            <table className="min-w-full divide-y divide-gray-200 mt-6">
                                <thead className="text-white bg-black/10 backdrop-blur-xl border-b-4 border-[#8b2022]">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Number</th>
                                        {(auth.user.permissions.includes('paymentmethods_edit') || auth.user.permissions.includes('paymentmethods_delete')) && (
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="text-white bg-black/10 backdrop-blur-xl border-b-1 border-[#8b2022]">
                                    {data.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.number}</td>
                                            {(auth.user.permissions.includes('paymentmethods_edit') || auth.user.permissions.includes('paymentmethods_delete')) && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {auth.user.permissions.includes('paymentmethods_edit') && (
                                                        <Link href={route('paymentmethods.edit', item.id)} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                                    )}
                                                    {auth.user.permissions.includes('paymentmethods_delete') && (
                                                        <Link href={route('paymentmethods.destroy', item.id)} method="delete" as="button" type="button" className="text-red-600 hover:text-red-900 ml-4">Delete</Link>
                                                    )}
                                                </td>
                                            )}
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
