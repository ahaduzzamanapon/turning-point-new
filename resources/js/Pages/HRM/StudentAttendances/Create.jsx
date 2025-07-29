import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function StudentAttendanceCreate({ auth, students }) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        date: new Date().toISOString().slice(0, 10),
        status: 'present',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.student-attendances.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Record Student Attendance</h2>}
        >
            <Head title="Record Student Attendance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6 text-white">
                        <h3 className="text-2xl font-bold text-red-700 mb-6">Record New Student Attendance</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="student_id" className="block text-sm font-medium text-white">Student</label>
                                <select
                                    id="student_id"
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                    required
                                >
                                    <option value="">Select a Student</option>
                                    {students.map((student) => (
                                        <option key={student.id} value={student.id}>{student.candidate_full_name}</option>
                                    ))}
                                </select>
                                {errors.student_id && <div className="text-red-500 text-sm mt-1">{errors.student_id}</div>}
                            </div>

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
                                <label htmlFor="status" className="block text-sm font-medium text-white">Status</label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                    required
                                >
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="leave">Leave</option>
                                </select>
                                {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                            </div>

                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-white">Notes</label>
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                ></textarea>
                                {errors.notes && <div className="text-red-500 text-sm mt-1">{errors.notes}</div>}
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 bg-red-600 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    disabled={processing}
                                >
                                    Record Attendance
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}