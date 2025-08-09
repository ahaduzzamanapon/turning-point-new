import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function EmployeeCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        position: '',
        hire_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.employees.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Create Employee</h2>}
        >
            <Head title="Create Employee" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6 text-white">
                        <h3 className="text-2xl font-bold text-red-700 mb-6">Add New Employee</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white border border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white border border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                    required
                                />
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-white">Phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white border border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                />
                                {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-white">Address</label>
                                <textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white border border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                ></textarea>
                                {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                            </div>

                            <div>
                                <label htmlFor="position" className="block text-sm font-medium text-white">Position</label>
                                <input
                                    type="text"
                                    id="position"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white border border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                />
                                {errors.position && <div className="text-red-500 text-sm mt-1">{errors.position}</div>}
                            </div>

                            <div>
                                <label htmlFor="hire_date" className="block text-sm font-medium text-white">Hire Date</label>
                                <input
                                    type="date"
                                    id="hire_date"
                                    value={data.hire_date}
                                    onChange={(e) => setData('hire_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white border border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                />
                                {errors.hire_date && <div className="text-red-500 text-sm mt-1">{errors.hire_date}</div>}
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 bg-red-600 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    disabled={processing}
                                >
                                    Create Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}