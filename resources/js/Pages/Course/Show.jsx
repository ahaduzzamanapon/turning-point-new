import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function CourseShow({ auth, course }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Course Details</h2>}
        >
            <Head title="Course Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <h3 className="text-xl font-bold mb-4">{course.name}</h3>
                            <p><strong>Amount:</strong> {course.amount}</p>
                            <p><strong>Start Date:</strong> {course.start_date}</p>
                            <p><strong>End Date:</strong> {course.end_date}</p>
                            <p><strong>Status:</strong> {course.status}</p>
                            <p><strong>Description:</strong> {course.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}