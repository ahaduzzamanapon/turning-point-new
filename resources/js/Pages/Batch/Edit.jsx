import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function BatchEdit({ auth, batch, courses }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        course_id: batch.course_id || '',
        name: batch.name || '',
        start_time: batch.start_time || '',
        end_time: batch.end_time || '',
        status: batch.status || 'active',
    });

    useEffect(() => {
        setData({
            course_id: batch.course_id || '',
            name: batch.name || '',
            start_time: batch.start_time || '',
            end_time: batch.end_time || '',
            status: batch.status || 'active',
        });
    }, [batch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.batches.update', batch.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Edit Batch</h2>}
        >
            <Head title="Edit Batch" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="course_id" className="block text-sm font-medium text-white">Course</label>
                                    <select
                                        id="course_id"
                                        value={data.course_id}
                                        onChange={(e) => setData('course_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    >
                                        <option value="">Select a Course</option>
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>
                                                {course.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.course_id && <div className="text-red-500 text-sm mt-1">{errors.course_id}</div>}
                                </div>

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-white">Batch Name</label>
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
                                    <label htmlFor="start_time" className="block text-sm font-medium text-white">Start Time</label>
                                    <input
                                        type="time"
                                        id="start_time"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                    {errors.start_time && <div className="text-red-500 text-sm mt-1">{errors.start_time}</div>}
                                </div>

                                <div>
                                    <label htmlFor="end_time" className="block text-sm font-medium text-white">End Time</label>
                                    <input
                                        type="time"
                                        id="end_time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                    {errors.end_time && <div className="text-red-500 text-sm mt-1">{errors.end_time}</div>}
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

                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        disabled={processing}
                                    >
                                        Update Batch
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