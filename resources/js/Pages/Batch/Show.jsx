import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function BatchShow({ auth, batch }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Batch Details</h2>}
        >
            <Head title="Batch Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <h3 className="text-xl font-bold mb-4">{batch.name}</h3>
                            <p><strong>Course:</strong> {batch.course.name}</p>
                            <p><strong>Start Time:</strong> {batch.start_time}</p>
                            <p><strong>End Time:</strong> {batch.end_time}</p>
                            <p><strong>Status:</strong> {batch.status}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}