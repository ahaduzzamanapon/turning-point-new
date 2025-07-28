import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal'; // Assuming you have a Modal component

export default function StudentIndex({ auth, students, courses, batches, paymentMethods, representatives }) {
    const { delete: destroy, patch, post } = useForm();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedRepresentative, setSelectedRepresentative] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentStudentPayment, setCurrentStudentPayment] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);

    

    const openPaymentModal = (student) => {
        setCurrentStudentPayment(student);
        setShowPaymentModal(true);
    };

    const handlePaymentVerification = (isVerified) => {
        if (currentStudentPayment) {
            post(route('admin.students.verifyPayment', currentStudentPayment.id), {
                is_verified: isVerified,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowPaymentModal(false);
                    setCurrentStudentPayment(null);
                    console.log('Payment verification successful!');
                },
                onError: (errors) => {
                    console.error('Payment verification failed:', errors);
                },
            });
            window.location.reload();
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this student?')) {
            destroy(route('admin.students.destroy', id));
        }
    };

    const toggleActiveStatus = (id) => {
        post(route('admin.students.toggleActiveStatus', id));
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(filteredStudents.map(student => student.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (e, id) => {
        if (e.target.checked) {
            setSelectedStudents(prev => [...prev, id]);
        } else {
            setSelectedStudents(prev => prev.filter(studentId => studentId !== id));
        }
    };

    const handleBulkUpdateStatus = (status) => {
        if (selectedStudents.length === 0) {
            alert('Please select at least one student.');
            return;
        }
      
        if (confirm(`Are you sure you want to ${status ? 'activate' : 'deactivate'} selected students?`)) {
            post(route('admin.students.bulkUpdateStatus'), {
                ids: selectedStudents,
                is_active: status,
            }, {
                onSuccess: () => {
                    console.log('Bulk update status successful!');
                    setSelectedStudents([]); // Clear selection after action
                },
                onError: (errors) => {
                    console.error('Bulk update status failed:', errors);
                },
            });
        }
    };

    const handleMarkRegistrationComplete = (id) => {
        console.log('Sending markRegistrationComplete as POST request.');
        if (confirm("Are you sure you want to mark this student's registration as complete?")) {
            post(route('admin.students.markRegistrationComplete', id));
        }
    };

    const handleBulkRegistrationComplete = () => {
        if (selectedStudents.length === 0) {
            alert('Please select at least one student.');
            return;
        }
        const routeUrl = route('admin.students.bulkMarkRegistrationComplete');
        if (confirm("Are you sure you want to mark selected student's registration as complete?")) {
            post(routeUrl, {
                ids: selectedStudents,
            }, {
                onSuccess: () => {
                    console.log('Bulk registration complete successful!');
                    setSelectedStudents([]); // Clear selection after action
                },
                onError: (errors) => {
                    console.error('Bulk registration complete failed:', errors);
                },
            });
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearchTerm = student.candidate_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  student.mobile_number.includes(searchTerm);

        const matchesCourse = selectedCourse === '' || student.course.id === parseInt(selectedCourse);
        const matchesBatch = selectedBatch === '' || student.batch.id === parseInt(selectedBatch);
        const matchesPaymentMethod = selectedPaymentMethod === '' || student.payment_method.id === parseInt(selectedPaymentMethod);
        const matchesRepresentative = selectedRepresentative === '' || student.representative.id === parseInt(selectedRepresentative);

        return matchesSearchTerm && matchesCourse && matchesBatch && matchesPaymentMethod && matchesRepresentative;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Students</h2>}
        >
            <Head title="Students" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-red-700">All Students</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleBulkUpdateStatus(true)}
                                        disabled={selectedStudents.length === 0}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                    >
                                        Activate Selected
                                    </button>
                                    <button
                                        onClick={() => handleBulkUpdateStatus(false)}
                                        disabled={selectedStudents.length === 0}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                    >
                                        Deactivate Selected
                                    </button>
                                    <button
                                        onClick={() => handleBulkRegistrationComplete()}
                                        disabled={selectedStudents.length === 0}
                                        className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 focus:bg-purple-700 active:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                    >
                                        Mark Registration Complete
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4 flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mt-1 block rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-[20%]"
                                />
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => {
                                        setSelectedCourse(e.target.value);
                                        setSelectedBatch(''); // Reset batch when course changes
                                    }}
                                    className="mt-1 block rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-[20%]"
                                >
                                    <option value="">All Courses</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.name}</option>
                                    ))}
                                </select>
                                
                                <select
                                    value={selectedPaymentMethod}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    className="mt-1 block rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-[20%]"
                                >
                                    <option value="">All Payment Methods</option>
                                    {paymentMethods.map(method => (
                                        <option key={method.id} value={method.id}>{method.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedRepresentative}
                                    onChange={(e) => setSelectedRepresentative(e.target.value)}
                                    className="mt-1 block rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-[20%]"
                                >
                                    <option value="">All Representatives</option>
                                    {representatives.map(rep => (
                                        <option key={rep.id} value={rep.id}>{rep.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="text-white bg-black/10 backdrop-blur-xl border-b-4 border-[#8b2022]">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                                                    className="rounded border-gray-300 text-red-600 shadow-sm focus:ring-red-500"
                                                />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Mobile</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Course</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">batch</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Payment Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Registration Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white bg-black/10 backdrop-blur-xl border-b-1 border-[#8b2022]">
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((student) => (
                                                <tr key={student.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStudents.includes(student.id)}
                                                            onChange={(e) => handleSelectStudent(e, student.id)}
                                                            className="rounded border-gray-300 text-red-600 shadow-sm focus:ring-red-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{student.candidate_full_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.mobile_number}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.course.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.batch.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                        {student.is_active ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            student.payment_status === 'verified' ? 'bg-green-100 text-green-800' :
                                                            student.payment_status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {student.payment_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            student.registration_status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {student.registration_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('admin.students.edit', student.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(student.id)}
                                                            className="text-red-600 hover:text-red-900 mr-3"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={() => toggleActiveStatus(student.id)}
                                                            className={`${
                                                                student.is_active
                                                                    ? 'bg-yellow-500 hover:bg-yellow-600'
                                                                    : 'bg-green-500 hover:bg-green-600'
                                                            } text-white px-3 py-1 rounded-md text-xs font-semibold`}
                                                        >
                                                            {student.is_active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <button
                                                            onClick={() => openPaymentModal(student)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold ml-3"
                                                        >
                                                            Verify Payment
                                                        </button>
                                                        {student.registration_status !== 'completed' && (
                                                            <button
                                                                onClick={() => handleMarkRegistrationComplete(student.id)}
                                                                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-xs font-semibold ml-3"
                                                            >
                                                                Mark Complete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">No students found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
                    {currentStudentPayment && (
                        <div className="space-y-2">
                            <p><strong>Candidate Name:</strong> {currentStudentPayment.candidate_full_name}</p>
                            <p><strong>Mobile Number:</strong> {currentStudentPayment.mobile_number}</p>
                            <p><strong>Email:</strong> {currentStudentPayment.email}</p>
                            <p><strong>Payment Method:</strong> {currentStudentPayment.payment_method.name}</p>
                            <p><strong>Sender Mobile Number:</strong> {currentStudentPayment.sender_mobile_number}</p>
                            <p><strong>Amount Sent:</strong> {currentStudentPayment.amount_sent}</p>
                            <p><strong>Transaction ID:</strong> {currentStudentPayment.transaction_id}</p>
                            <p><strong>Course Interested:</strong> {currentStudentPayment.course.name}</p>
                            <p><strong>Batch Interested:</strong> {currentStudentPayment.batch.name}</p>
                            <p><strong>Representative:</strong> {currentStudentPayment.representative.name}</p>
                        </div>
                    )}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => handlePaymentVerification(false)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Reject Payment
                        </button>
                        <button
                            onClick={() => handlePaymentVerification(true)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Verify Payment
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}