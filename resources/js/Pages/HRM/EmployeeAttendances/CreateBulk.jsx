import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function EmployeeAttendanceCreateBulk({ auth, employees, date }) {
    const { data, setData, post, processing, errors } = useForm({
        date: date,
        employees: employees.map(emp => ({
            id: emp.id,
            name: emp.name,
            status: emp.status,
            notes: emp.notes,
        })),
    });

    const handleStatusChange = (employeeId, status) => {
        setData('employees', data.employees.map(emp =>
            emp.id === employeeId ? { ...emp, status: status } : emp
        ));
    };

    const handleNotesChange = (employeeId, notes) => {
        setData('employees', data.employees.map(emp =>
            emp.id === employeeId ? { ...emp, notes: notes } : emp
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.employee-attendances.storeBulk'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Record Daily Employee Attendance</h2>}
        >
            <Head title="Record Daily Employee Attendance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6 text-white">
                        <h3 className="text-2xl font-bold text-red-700 mb-6">Record Attendance for {date}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input type="hidden" value={data.date} />
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="text-white bg-black/10 backdrop-blur-xl border-b-4 border-[#8b2022]">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Employee Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white bg-black/10 backdrop-blur-xl border-b-1 border-[#8b2022]">
                                        {data.employees.map((employee) => (
                                            <tr key={employee.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{employee.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                    <select
                                                        value={employee.status}
                                                        onChange={(e) => handleStatusChange(employee.id, e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                                    >
                                                        <option value="present">Present</option>
                                                        <option value="absent">Absent</option>
                                                        <option value="leave">Leave</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                    <input
                                                        type="text"
                                                        value={employee.notes}
                                                        onChange={(e) => handleNotesChange(employee.id, e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 bg-red-600 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    disabled={processing}
                                >
                                    Save Attendance
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}