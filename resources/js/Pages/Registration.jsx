import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

export default function Registration() {
    const { data, setData, post, processing, errors, reset } = useForm({
        candidate_full_name: '',
        bach_interested_id: '',
        mobile_number: '',
        email: '',
        full_address: '',
        payment_method_id: '',
        sender_mobile_number: '',
        amount_sent: '',
        transaction_id: '',
        course_interested_id: '',
        facebook_profile_link: '',
        representative_id: '',
    });

    const [courses, setCourses] = useState([]);
    const [representatives, setRepresentatives] = useState([]);
    const [batches, setBatches] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        fetch('/api/courses')
            .then(response => response.json())
            .then(data => setCourses(data));

        fetch('/api/representatives')
            .then(response => response.json())
            .then(data => setRepresentatives(data));

        fetch('/api/batches')
            .then(response => response.json())
            .then(data => setBatches(data));

        fetch('/api/payment-methods')
            .then(response => response.json())
            .then(data => setPaymentMethods(data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.register'), {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'Our team will contact you shortly.',
                    showConfirmButton: false,
                    timer: 3000
                }).then(() => {
                    window.location = '/';
                });
            },
            onError: (errors) => {
                console.error('Registration failed:', errors);
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed!',
                    text: 'Please check the form for errors.',
                });
            },
        });
    };

    // Background image for consistency with login/welcome
    const backgroundImageUrl = 'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1951&q=80';


    return (
        <>
            <Head title="Registration Form - Turning Point Job Aid" />
            <div
                className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative"
                style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 via-cyan-600/50 to-blue-600/50 dark:from-purple-900/70 dark:via-cyan-900/70 dark:to-blue-900/70"></div>

                <div className="relative max-w-4xl w-full bg-black/30 backdrop-blur-xl p-8 rounded-xl shadow-lg border border-white/10 text-white"> {/* Transparent form container */}
                    <div className="flex justify-center mb-6">
                        {/* You can add a logo here if needed */}
                    </div>
                    <h2 className="text-4xl font-bold text-center text-maroon mb-6">Admission Form</h2> {/* Maroon accent */}
                    <p className="text-maroon text-center mb-4 text-lg">💥 সকল তথ্য ইংরেজিতে দিতে হবে। [ '*' চিহ্নিত সকল অপশন সঠিকভাবে পূরণ করুন] </p> {/* Maroon accent */}
                    <p className="text-gray-300 text-center mb-8 text-md">নিম্নের তথ্যগুলো সতর্কতার সাথে পূরণ করুন। তথ্য প্রদানে কোনো সমস্যা হলে 01896 22 42 02/05/06/07/08/10/11 -এ যোগাযোগ করুন। আমাদের ফেসবুক লাইভের উন্মুক্ত ক্লাসগুলো ছাড়া অন্যকোনো অনলাইন ক্লাস কর্তৃপক্ষের অনুমতি ব্যতীত রেকডিং করা, হোয়ার্টসঅ্যাপ, ফেসবুক, ইউটিউব বা অন্যকোনো সোশাল মিডিয়ায় শেয়ার করলে ডিজিটাল নিরাপত্তা আইন ২০১৮ অনুযায়ী ব্যবস্থা নেওয়া হবে।</p>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label htmlFor="course_interested_id" className="block text-sm font-medium text-white">Choose Your Course <span className="text-maroon">*</span></label>
                            <select
                                id="course_interested_id"
                                value={data.course_interested_id}
                                onChange={(e) => {
                                    const courseId = e.target.value;
                                    setData('course_interested_id', courseId);
                                    setData('bach_interested_id', ''); // Reset batch when course changes
                                    if (courseId) {
                                        fetch(`/api/courses/${courseId}/batches`)
                                            .then(response => response.json())
                                            .then(data => setBatches(data));
                                    } else {
                                        setBatches([]);
                                    }
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            >
                                <option value="" className="bg-gray-800 text-white">Choose Your Course</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id} className="bg-gray-800 text-white">{course.name}</option>
                                ))}
                            </select>
                            {errors.course_interested_id && <div className="text-maroon text-sm mt-1">{errors.course_interested_id}</div>}
                        </div>

                        <div>
                            <label htmlFor="candidate_full_name" className="block text-sm font-medium text-white">Candidate Full Name (in English) <span className="text-maroon">*</span></label>
                            <input
                                type="text"
                                id="candidate_full_name"
                                value={data.candidate_full_name}
                                onChange={(e) => setData('candidate_full_name', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            />
                            {errors.candidate_full_name && <div className="text-maroon text-sm mt-1">{errors.candidate_full_name}</div>}
                        </div>

                        <div>
                            <label htmlFor="mobile_number" className="block text-sm font-medium text-white">📞 Mobile Number (Used) <span className="text-maroon">*</span></label>
                            <input
                                type="text"
                                id="mobile_number"
                                value={data.mobile_number}
                                onChange={(e) => setData('mobile_number', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            />
                            {errors.mobile_number && <div className="text-maroon text-sm mt-1">{errors.mobile_number}</div>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white">📧 Email <span className="text-maroon">*</span></label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            />
                            {errors.email && <div className="text-maroon text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label htmlFor="full_address" className="block text-sm font-medium text-white">Your full address / সুন্দরবন কুরিয়ারে শিট পাঠানোর ঠিকানা <span className="text-maroon">*</span></label>
                            <textarea
                                id="full_address"
                                value={data.full_address}
                                onChange={(e) => setData('full_address', e.target.value)}
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            ></textarea>
                            {errors.full_address && <div className="text-maroon text-sm mt-1">{errors.full_address}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Your payment methods <span className="text-maroon">*</span></label>
                            <div className="mt-1 space-y-2">
                                {paymentMethods.map((method) => (
                                    <div className="flex items-center" key={method.id}>
                                        <input
                                            type="radio"
                                            id={method.name}
                                            name="payment_method"
                                            value={method.id}
                                            onChange={(e) => setData('payment_method_id', e.target.value)}
                                            className="focus:ring-maroon h-4 w-4 text-maroon border-gray-300 bg-white/20" // Transparent radio
                                            required
                                        />
                                        <label htmlFor={method.name} className="ml-3 block text-sm font-medium text-white">{method.name} : {method.number}</label>
                                    </div>
                                ))}
                            </div>
                            {errors.payment_method_id && <div className="text-maroon text-sm mt-1">{errors.payment_method_id}</div>}
                        </div>

                        <div>
                            <label htmlFor="sender_mobile_number" className="block text-sm font-medium text-white">আপনি যে নম্বর থেকে আমাদের বিকাশ মার্চেন্ট/রকেট পার্সোনাল/নগদ পার্সোনাল নম্বর টাকা পাঠিয়েছেন, সেই নাম্বরটি দিন <span className="text-maroon">*</span></label>
                            <input
                                type="text"
                                id="sender_mobile_number"
                                value={data.sender_mobile_number}
                                onChange={(e) => setData('sender_mobile_number', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            />
                            {errors.sender_mobile_number && <div className="text-maroon text-sm mt-1">{errors.sender_mobile_number}</div>}
                        </div>

                        <div>
                            <label htmlFor="amount_sent" className="block text-sm font-medium text-white">পাঠানো টাকার পরিমাণ উল্লেখ করুন <span className="text-maroon">*</span></label>
                            <input
                                type="number"
                                id="amount_sent"
                                value={data.amount_sent}
                                onChange={(e) => setData('amount_sent', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            />
                            {errors.amount_sent && <div className="text-maroon text-sm mt-1">{errors.amount_sent}</div>}
                        </div>

                        <div>
                            <label htmlFor="transaction_id" className="block text-sm font-medium text-white">রকেটে / নগদ / বিকাশ পাঠানো লেনদেন (Transactions ID) আইডি টি দিন <span className="text-maroon">*</span></label>
                            <input
                                type="text"
                                id="transaction_id"
                                value={data.transaction_id}
                                onChange={(e) => setData('transaction_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            />
                            {errors.transaction_id && <div className="text-maroon text-sm mt-1">{errors.transaction_id}</div>}
                        </div>

                         <div>
                            <label htmlFor="bach_interested_id" className="block text-sm font-medium text-white">যে ব্যাচে ভর্তি হতে আগ্রহী? <span className="text-maroon">*</span></label>
                            <select
                                id="bach_interested_id"
                                value={data.bach_interested_id}
                                onChange={(e) => setData('bach_interested_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            >
                                <option value="" className="bg-gray-800 text-white">ব্যাচ নির্বাচন করুন</option>
                                {batches.map((batch) => (
                                    <option key={batch.id} value={batch.id} className="bg-gray-800 text-white">{batch.name}</option>
                                ))}
                            </select>
                            {errors.bach_interested_id && <div className="text-maroon text-sm mt-1">{errors.bach_interested_id}</div>}
                        </div>

                        <div>
                            <label htmlFor="facebook_profile_link" className="block text-sm font-medium text-white">আপনার ফেসবুক প্রোফাইল লিংক দিন (যেমন: www.facebook.com/turningpointjobaid) <span className="text-maroon">*</span></label>
                            <input
                                type="text"
                                id="facebook_profile_link"
                                value={data.facebook_profile_link}
                                onChange={(e) => setData('facebook_profile_link', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            />
                            {errors.facebook_profile_link && <div className="text-maroon text-sm mt-1">{errors.facebook_profile_link}</div>}
                        </div>

                        <div>
                            <label htmlFor="representative_id" className="block text-sm font-medium text-white">আপনি আমাদের যে প্রতিনিধির সাথে WhatsApp যুক্ত আছেন বা কথা বলে এডমিশন নিয়েছেন তার নাম নির্বাচন করুন? <span className="text-maroon">*</span></label>
                            <select
                                id="representative_id"
                                value={data.representative_id}
                                onChange={(e) => setData('representative_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white/20 backdrop-blur-sm border border-white/10 focus:border-maroon focus:ring focus:ring-maroon/50 p-2 text-white" // Transparent input
                                required
                            >
                                <option value="" className="bg-gray-800 text-white">Select a Representative</option>
                                {representatives.map((rep) => (
                                    <option key={rep.id} value={rep.id} className="bg-gray-800 text-white">{rep.name} - {rep.number}</option>
                                ))}
                            </select>
                            {errors.representative_id && <div className="text-maroon text-sm mt-1">{errors.representative_id}</div>}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="agreement"
                                className="h-4 w-4 text-maroon focus:ring-maroon border-gray-300 rounded bg-white/20" // Transparent checkbox
                                required
                            />
                            <label htmlFor="agreement" className="ml-2 block text-sm text-white">
                                আপনি এই শর্ত মেনে ভর্তি হয়েছেন যে, কোন অবস্থাতেই ভর্তি বাতিল করা যাবে না এবং টাকা ফেরতযোগ্য নয়,ধন্যবাদ।*
                            </label>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center px-6 py-3 bg-maroon border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-maroon/80 focus:bg-maroon/80 active:bg-maroon/90 focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-2 transition ease-in-out duration-150" // Maroon button
                                disabled={processing}
                            >
                                Register Now
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
