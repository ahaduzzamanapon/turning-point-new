import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function StudentEdit({ auth, student, courses, batches, paymentMethods, representatives }) {
    const { data, setData, put, processing, errors } = useForm({
        candidate_full_name: student.candidate_full_name || '',
        mobile_number: student.mobile_number || '',
        email: student.email || '',
        full_address: student.full_address || '',
        payment_method_id: student.payment_method_id || '',
        sender_mobile_number: student.sender_mobile_number || '',
        amount_sent: student.amount_sent || '',
        transaction_id: student.transaction_id || '',
        course_interested_id: student.course_interested_id || '',
        bach_interested_id: student.bach_interested_id || '',
        facebook_profile_link: student.facebook_profile_link || '',
        representative_id: student.representative_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.students.update', student.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Edit Student</h2>}
        >
            <Head title="Edit Student" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6 min-h-[73vh]">
                        <div className="p-6 text-white">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div>
                                    <label htmlFor="course_interested" className="block text-sm font-medium text-white">Choose Your Course <span className="text-red-500">*</span></label>
                                    <select
                                        id="course_interested"
                                        value={data.course_interested_id}
                                        onChange={(e) => setData('course_interested_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    >
                                        <option value="">Choose Your Course</option>
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>{course.name}</option>
                                        ))}
                                    </select>
                                    {errors.course_interested && <div className="text-red-500 text-sm mt-1">{errors.course_interested}</div>}
                                </div>

                                <div>
                                    <label htmlFor="candidate_full_name" className="block text-sm font-medium text-white">Candidate Full Name (in English) <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="candidate_full_name"
                                        value={data.candidate_full_name}
                                        onChange={(e) => setData('candidate_full_name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    />
                                    {errors.candidate_full_name && <div className="text-red-500 text-sm mt-1">{errors.candidate_full_name}</div>}
                                </div>

                                <div>
                                    <label htmlFor="mobile_number" className="block text-sm font-medium text-white">📞  Mobile Number (Used) <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="mobile_number"
                                        value={data.mobile_number}
                                        onChange={(e) => setData('mobile_number', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    />
                                    {errors.mobile_number && <div className="text-red-500 text-sm mt-1">{errors.mobile_number}</div>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white">📧 Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    />
                                    {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                </div>

                                <div>
                                    <label htmlFor="full_address" className="block text-sm font-medium text-white">Your full address / সুন্দরবন কুরিয়ারে শিট পাঠানোর ঠিকানা <span className="text-red-500">*</span></label>
                                    <textarea
                                        id="full_address"
                                        value={data.full_address}
                                        onChange={(e) => setData('full_address', e.target.value)}
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    ></textarea>
                                    {errors.full_address && <div className="text-red-500 text-sm mt-1">{errors.full_address}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Your payment methods <span className="text-red-500">*</span></label>
                                    <div className="mt-1 space-y-2">
                                        {paymentMethods.map((method) => (
                                            <div key={method.id} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`payment_method_${method.id}`}
                                                    name="payment_method_id"
                                                    value={method.id}
                                                    onChange={(e) => setData('payment_method_id', e.target.value)}
                                                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                                                    checked={data.payment_method_id == method.id}
                                                    required
                                                />
                                                <label htmlFor={`payment_method_${method.id}`} className="ml-3 block text-sm font-medium text-white">{method.name} : {method.number}</label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.payment_method_id && <div className="text-red-500 text-sm mt-1">{errors.payment_method_id}</div>}
                                </div>

                                <div>
                                    <label htmlFor="sender_mobile_number" className="block text-sm font-medium text-white">আপনি যে নম্বর থেকে আমাদের বিকাশ  মার্চেন্ট/রকেট পার্সোনাল/নগদ পার্সোনাল নম্বর  টাকা পাঠিয়েছেন, সেই নাম্বরটি দিন <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="sender_mobile_number"
                                        value={data.sender_mobile_number}
                                        onChange={(e) => setData('sender_mobile_number', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    />
                                    {errors.sender_mobile_number && <div className="text-red-500 text-sm mt-1">{errors.sender_mobile_number}</div>}
                                </div>

                                <div>
                                    <label htmlFor="amount_sent" className="block text-sm font-medium text-white">পাঠানো টাকার পরিমাণ উল্লেখ করুন <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        id="amount_sent"
                                        value={data.amount_sent}
                                        onChange={(e) => setData('amount_sent', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    />
                                    {errors.amount_sent && <div className="text-red-500 text-sm mt-1">{errors.amount_sent}</div>}
                                </div>

                                <div>
                                    <label htmlFor="transaction_id" className="block text-sm font-medium text-white">রকেটে / নগদ / বিকাশ  পাঠানো লেনদেন (Transactions ID) আইডি টি দিন <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="transaction_id"
                                        value={data.transaction_id}
                                        onChange={(e) => setData('transaction_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    />
                                    {errors.transaction_id && <div className="text-red-500 text-sm mt-1">{errors.transaction_id}</div>}
                                </div>

                                <div>
                                    <label htmlFor="bach_interested" className="block text-sm font-medium text-white">যে ব্যাচে ভর্তি হতে আগ্রহী? <span className="text-red-500">*</span></label>
                                    <select
                                        id="bach_interested"
                                        value={data.bach_interested_id}
                                        onChange={(e) => setData('bach_interested_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    >
                                        <option value="">ব্যাচ নির্বাচন করুন</option>
                                        {batches.map((batch) => (
                                            <option key={batch.id} value={batch.id}>{batch.name}</option>
                                        ))}
                                    </select>
                                    {errors.bach_interested_id && <div className="text-red-500 text-sm mt-1">{errors.bach_interested_id}</div>}
                                </div>



                                <div>
                                    <label htmlFor="facebook_profile_link" className="block text-sm font-medium text-white">আপনার ফেসবুক প্রোফাইল লিংক দিন (যেমন: www.facebook.com/turningpointjobaid) <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="facebook_profile_link"
                                        value={data.facebook_profile_link}
                                        onChange={(e) => setData('facebook_profile_link', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    />
                                    {errors.facebook_profile_link && <div className="text-red-500 text-sm mt-1">{errors.facebook_profile_link}</div>}
                                </div>

                                <div>
                                    <label htmlFor="representative_name" className="block text-sm font-medium text-white">আপনি আমাদের যে প্রতিনিধির সাথে  WhatsApp যুক্ত আছেন বা  কথা বলে এডমিশন নিয়েছেন তার নাম নির্বাচন করুন? <span className="text-red-500">*</span></label>
                                    <select
                                        id="representative_name"
                                        value={data.representative_id}
                                        onChange={(e) => setData('representative_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    >
                                        <option value="">Select a Representative</option>
                                        {representatives.map((rep) => (
                                            <option key={rep.id} value={rep.id}>{rep.name}</option>
                                        ))}
                                    </select>
                                    {errors.representative_id && <div className="text-red-500 text-sm mt-1">{errors.representative_id}</div>}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="agreement"
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        required
                                    />
                                    <label htmlFor="agreement" className="ml-2 block text-sm text-white">
                                        আপনি এই শর্ত মেনে ভর্তি হয়েছেন যে, কোন অবস্থাতেই ভর্তি বাতিল করা যাবে না এবং টাকা ফেরতযোগ্য নয়,ধন্যবাদ।*
                                    </label>
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-3 bg-red-600 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        disabled={processing}
                                    >
                                        Register Now
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