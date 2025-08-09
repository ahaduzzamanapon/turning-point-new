import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function LedgerWiseExpenses({ auth, expenses, filters, ledgers }) {
    const { data, setData, get } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        ledger_id: filters.ledger_id || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('admin.reports.expenses'), data, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Ledger-wise Expenses Report</h2>}
        >
            <Head title="Ledger-wise Expenses Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6 text-white">
                        <h3 className="text-2xl font-bold text-red-700 mb-6">Ledger-wise Expenses Report</h3>

                        <form onSubmit={handleFilter} className="mb-6 flex space-x-4">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-white">Start Date</label>
                                <input
                                    type="date"
                                    id="start_date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="mt-1 block rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-white">End Date</label>
                                <input
                                    type="date"
                                    id="end_date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="mt-1 block rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="ledger_id" className="block text-sm font-medium text-white">Ledger</label>
                                <select
                                    id="ledger_id"
                                    value={data.ledger_id}
                                    onChange={(e) => setData('ledger_id', e.target.value)}
                                    className="mt-1 block rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                >
                                    <option value="">All Ledgers</option>
                                    {ledgers.map((ledger) => (
                                        <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Filter
                                </button>
                                <a
                                    href={route('admin.reports.exportLedgerWiseExpenses', data)}
                                    className="ml-4 inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Export to Excel
                                </a>
                            </div>
                        </form>

                        {Object.keys(expenses).length > 0 ? (
                            Object.keys(expenses).map((ledgerName) => (
                                <div key={ledgerName} className="mb-8">
                                    <h4 className="text-xl font-semibold text-red-500 mb-4">{ledgerName}</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 mb-4">
                                            <thead className="text-white bg-black/10 backdrop-blur-xl border-b-4 border-[#8b2022]">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-white bg-black/10 backdrop-blur-xl border-b-1 border-[#8b2022]">
                                                {expenses[ledgerName].map((expense) => (
                                                    <tr key={expense.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{new Date(expense.date).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{expense.amount}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{expense.description}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-right text-lg font-bold">Total {ledgerName} Expenses: {expenses[ledgerName].reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-white">No expenses found for the selected date range.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}