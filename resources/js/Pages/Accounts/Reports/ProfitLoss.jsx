import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function ProfitLoss({ auth, totalExpenses, totalIncomes, profitLoss, filters }) {
    const { data, setData, get } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('admin.reports.profitLoss'), data, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Profit & Loss Report</h2>}
        >
            <Head title="Profit & Loss Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6 text-white">
                        <h3 className="text-2xl font-bold text-red-700 mb-6">Profit & Loss Report</h3>

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
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Filter
                                </button>
                                <a
                                    href={route('admin.reports.exportProfitLoss', data)}
                                    className="ml-4 inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Export to Excel
                                </a>
                            </div>
                        </form>

                        <div className="space-y-4">
                            <p className="text-lg">Total Incomes: <span className="font-bold text-green-500">{totalIncomes.toFixed(2)}</span></p>
                            <p className="text-lg">Total Expenses: <span className="font-bold text-red-500">{totalExpenses.toFixed(2)}</span></p>
                            <p className="text-xl">Profit/Loss: <span className={`font-bold ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>{profitLoss.toFixed(2)}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}