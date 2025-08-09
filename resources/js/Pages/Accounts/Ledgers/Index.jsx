import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function LedgerIndex({ auth, ledgers }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Ledgers</h2>}
        >
            <Head title="Ledgers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6 text-white">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-red-700">All Ledgers</h3>
                            <Link href={route('admin.ledgers.create')} className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150">Add New Ledger</Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-white bg-black/10 backdrop-blur-xl border-b-4 border-[#8b2022]">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white bg-black/10 backdrop-blur-xl border-b-1 border-[#8b2022]">
                                    {ledgers.length > 0 ? (
                                        ledgers.map((ledger) => (
                                            <tr key={ledger.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{ledger.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{ledger.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{ledger.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link href={route('admin.ledgers.edit', ledger.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link>
                                                    <button onClick={() => {
                                                        if (confirm('Are you sure you want to delete this ledger?')) {
                                                            Inertia.delete(route('admin.ledgers.destroy', ledger.id));
                                                        }
                                                    }} className="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">No ledgers found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}