import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ExpenseCreate({ auth, ledgers }) {
    const { data, setData, post, processing, errors } = useForm({
        ledger_id: '',
        amount: '',
        description: '',
        date: new Date().toISOString().slice(0, 10),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.expenses.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Create Expense</h2>}
        >
            <Head title="Create Expense" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6 text-white">
                        <h3 className="text-2xl font-bold text-red-700 mb-6">Add New Expense</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-white">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                    required
                                />
                                {errors.date && <div className="text-red-500 text-sm mt-1">{errors.date}</div>}
                            </div>

                            <div>
                                <label htmlFor="ledger_id" className="block text-sm font-medium text-white">Ledger</label>
                                <select
                                    id="ledger_id"
                                    value={data.ledger_id}
                                    onChange={(e) => setData('ledger_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                    required
                                >
                                    <option value="">Select a Ledger</option>
                                    {ledgers.map((ledger) => (
                                        <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                                    ))}
                                </select>
                                {errors.ledger_id && <div className="text-red-500 text-sm mt-1">{errors.ledger_id}</div>}
                            </div>

                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-white">Amount</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                    required
                                />
                                {errors.amount && <div className="text-red-500 text-sm mt-1">{errors.amount}</div>}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                ></textarea>
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 bg-red-600 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    disabled={processing}
                                >
                                    Create Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}