import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';
import Modal from '@/Components/Modal'; // Assuming you have a Modal component
import Dropdown from '@/Components/Dropdown';
import PrimaryButton from '@/Components/PrimaryButton';

export default function StudentIndex({ auth, students, courses, batches, paymentMethods, representatives }) {
    const { delete: destroy, patch, post } = useForm();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedRepresentative, setSelectedRepresentative] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentStudentPayment, setCurrentStudentPayment] = useState(null);
    const [showDuePaymentModal, setShowDuePaymentModal] = useState(false);
    const [currentStudentDuePayment, setCurrentStudentDuePayment] = useState(null);
    const [dueAmountInput, setDueAmountInput] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);



    const openPaymentModal = (student) => {
        setCurrentStudentPayment(student);
        setShowPaymentModal(true);
    };

    const openDuePaymentModal = (student) => {
        setCurrentStudentDuePayment(student);
        setDueAmountInput(''); // Clear previous input
        setShowDuePaymentModal(true);
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

    const handleDuePayment = () => { if (currentStudentDuePayment && dueAmountInput > 0) { Inertia.post(route('admin.students.updateDuePayment', currentStudentDuePayment.id), { amount_paid: parseFloat(dueAmountInput), }, { preserveScroll: true, onSuccess: () => { setShowDuePaymentModal(false); setCurrentStudentDuePayment(null); setDueAmountInput(''); console.log('Due payment recorded successfully!'); }, onError: (errors) => { console.error('Due payment failed:', errors); alert('Error: ' + Object.values(errors).join('\n')); }, }); } else { alert('Please enter a valid amount.'); } };

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

        const matchesCourse = selectedCourse === '' || student.course_interested_id === parseInt(selectedCourse);
        const matchesBatch = selectedBatch === '' || student.bach_interested_id === parseInt(selectedBatch);
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

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6 min-h-[73vh]">
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
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    className="mt-1 block rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-[20%]"
                                >
                                    <option value="">All Batches</option>
                                    {batches
                                        .filter(batch => selectedCourse === '' || batch.course_id === parseInt(selectedCourse))
                                        .map(batch => (
                                            <option key={batch.id} value={batch.id}>{batch.name}</option>
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

                            <div className="overflow-x-auto min-h-[40vh]" >
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
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Student ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Mobile</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Course</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Batch</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Course Fee</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Paid Amount</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Due Amount</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Registration Date</th>
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
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{student.student_id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{student.candidate_full_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.mobile_number}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.course.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.batch.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.course.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.amount_sent}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.course.amount - student.amount_sent}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{new Date(student.created_at).toLocaleDateString()}</td>
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
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.payment_status === 'verified' ? 'bg-green-100 text-green-800' :
                                                                student.payment_status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                    '                                                                                                                                                                                                                                                                                                                                '                                                                'bg-gray-100 text-gray-900'''
                                                            }`}>
                                                            {student.payment_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.registration_status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                '                                                                                                                                                                                                                                                                                                                                '                                                                'bg-gray-100 text-gray-900'''
                                                            }`}>
                                                            {student.registration_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Dropdown>
                                                            <Dropdown.Trigger>
                                                                <PrimaryButton>
                                                                    Actions
                                                                    <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </PrimaryButton>
                                                            </Dropdown.Trigger>
                                                            <Dropdown.Content>
                                                                <Dropdown.Link href={route('admin.students.edit', student.id)} className="text-indigo-600 hover:text-indigo-900"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>Edit</Dropdown.Link>
                                                                <button onClick={() => handleDelete(student.id)} className="block w-full px-4 py-2 text-start text-sm leading-5 text-red-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>Delete</button>
                                                                <button onClick={() => toggleActiveStatus(student.id)} className="block w-full px-4 py-2 text-start text-sm leading-5 text-yellow-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.293 3.293m7.532 7.532l-3.293-3.293M3 3l3.536 3.536m13.464 13.464L17 17" /></svg>{student.is_active ? 'Deactivate' : 'Activate'}</button>
                                                                <button onClick={() => openPaymentModal(student)} className="block w-full px-4 py-2 text-start text-sm leading-5 text-blue-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Verify Payment</button>
                                                                {student.registration_status !== 'completed' && (
                                                                    <button onClick={() => handleMarkRegistrationComplete(student.id)} className="block w-full px-4 py-2 text-start text-sm leading-5 text-purple-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>Mark Complete</button>
                                                                )}
                                                                {student.course.amount - student.amount_sent > 0 && (
                                                                    <button onClick={() => openDuePaymentModal(student)} className="block w-full px-4 py-2 text-start text-sm leading-5 text-orange-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>Pay Due</button>
                                                                )}
                                                            </Dropdown.Content>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">No students found.</td>
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

            <Modal show={showDuePaymentModal} onClose={() => setShowDuePaymentModal(false)} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Record Due Payment</h2>
                    {currentStudentDuePayment && (
                        <div className="space-y-2">
                            <p><strong>Student ID:</strong> {currentStudentDuePayment.student_id}</p>
                            <p><strong>Candidate Name:</strong> {currentStudentDuePayment.candidate_full_name}</p>
                            <p><strong>Course:</strong> {currentStudentDuePayment.course.name}</p>
                            <p><strong>Course Fee:</strong> {currentStudentDuePayment.course.amount}</p>
                            <p><strong>Amount Paid:</strong> {currentStudentDuePayment.amount_sent}</p>
                            <p><strong>Due Amount:</strong> {currentStudentDuePayment.course.amount - currentStudentDuePayment.amount_sent}</p>
                            <div className="mt-4">
                                <label htmlFor="dueAmount" className="block text-sm font-medium text-white">Amount to Pay:</label>
                                <input
                                    type="number"
                                    id="dueAmount"
                                    value={dueAmountInput}
                                    onChange={(e) => setDueAmountInput(e.target.value)}
                                                                                                                                                                                                                                                                                                className="mt-1 block w-full rounded-md border-gray-300 bg-white border border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>
                    )}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => setShowDuePaymentModal(false)}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDuePayment}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Record Payment
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}