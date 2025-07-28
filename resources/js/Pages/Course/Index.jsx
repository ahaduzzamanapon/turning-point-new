import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CourseIndex({ auth, data }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this course?')) {
            destroy(route('courses.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Courses</h2>}
        >
            <Head title="Courses" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-red-700">All Courses</h3>
                                <Link
                                    href={route('courses.create')}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Add New Course
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="text-white bg-black/10 backdrop-blur-xl border-b-4 border-[#8b2022]">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Start Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">End Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white bg-black/10 backdrop-blur-xl border-b-1 border-[#8b2022]">
                                        {data.length > 0 ? (
                                            data.map((course) => (
                                                <tr key={course.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{course.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{course.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{course.start_date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{course.end_date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{course.status}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('admin.courses.edit', course.id)}
                                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 transition ease-in-out duration-150"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(course.id)}
                                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-150"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">No courses found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}