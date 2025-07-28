import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function CourseEdit({ auth, model }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: model.name || '',
        amount: model.amount || '',
        start_date: model.start_date || '',
        end_date: model.end_date || '',
        status: model.status || 'active',
        description: model.description || '',
    });

    useEffect(() => {
        setData({
            name: model.name || '',
            amount: model.amount || '',
            start_date: model.start_date || '',
            end_date: model.end_date || '',
            status: model.status || 'active',
            description: model.description || '',
        });
    }, [model]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.courses.update', model.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Edit Course</h2>}
        >
            <Head title="Edit Course" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-white">Course Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                </div>

                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-white">Amount</label>
                                    <input
                                        type="number"
                                        id="amount"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                    {errors.amount && <div className="text-red-500 text-sm mt-1">{errors.amount}</div>}
                                </div>

                                <div>
                                    <label htmlFor="start_date" className="block text-sm font-medium text-white">Start Date</label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                    {errors.start_date && <div className="text-red-500 text-sm mt-1">{errors.start_date}</div>}
                                </div>

                                <div>
                                    <label htmlFor="end_date" className="block text-sm font-medium text-white">End Date</label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                    {errors.end_date && <div className="text-red-500 text-sm mt-1">{errors.end_date}</div>}
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-white">Status</label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    ></textarea>
                                    {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        disabled={processing}
                                    >
                                        Update Course
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