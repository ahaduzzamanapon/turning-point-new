import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function StudentCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        candidate_full_name: '',
        mobile_number: '',
        email: '',
        full_address: '',
        payment_method: '',
        sender_mobile_number: '',
        amount_sent: '',
        transaction_id: '',
        course_interested: '',
        bach_interested: '',
        facebook_profile_link: '',
        representative_name: '',
    });

    const courses = [
        "Ad + Govt. Bank + Private Bank Regular Batch (Pri.+Written)",
        "Premium Written Batch (Only Bank Job )",
        "IT Special Batch (Only Bank Job)",
        "Basic Course (Math +English)",
        "O.G Crash Course",
        "২৪ তম ব্যাচ (রাত ৮ টায়) রেগুলার (প্রিলি. + রিটেন)(Upcoming New Batch)",
        "IT Special Batch-01(Only Bank Job)",
        "Basic Course (Math +English)-01",
        "O.G Crash Course"
    ];

    const representatives = [
        "Sanjana -01896224207",
        "Zannat - 01896224202",
        "Liza -01896224206",
        "Nasrin -01896224208",
        "Tanusree -01896400336",
        "Antora - 01896400333",
        "Tania - 01896224205",
        "Bappi Das Sir - 01896224210",
        "Tarek Sir - 01896224200",
        "Mamun Sir- 01896224211"
    ];

    const bach = [
        "২৪ তম ব্যাচ (রাত ৮ টায়) রেগুলার (প্রিলি. + রিটেন)(Upcoming New Batch)",
        "IT Special Batch-01(Only Bank Job)",
        "Basic Course (Math +English)-01",
        "O.G  Crash Course",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.students.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Add New Student</h2>}
        >
            <Head title="Add Student" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div>
                                    <label htmlFor="course_interested" className="block text-sm font-medium text-white">Choose Your Course <span className="text-red-500">*</span></label>
                                    <select
                                        id="course_interested"
                                        value={data.course_interested}
                                        onChange={(e) => setData('course_interested', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    >
                                        <option value="">Choose Your Course</option>
                                        {courses.map((course, index) => (
                                            <option key={index} value={course}>{course}</option>
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
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="bkash"
                                                name="payment_method"
                                                value="Bkash (Merchant) (Payment) : 01896 22 42 00"
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                                                required
                                            />
                                            <label htmlFor="bkash" className="ml-3 block text-sm font-medium text-white">Bkash (Merchant) (Payment) : 01896 22 42 00</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="nagad"
                                                name="payment_method"
                                                value="Nagad (Merchant) (Payment) : 01896 22 42 01"
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                                            />
                                            <label htmlFor="nagad" className="ml-3 block text-sm font-medium text-white">Nagad (Merchant) (Payment) : 01896 22 42 01</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="cash_in_hand"
                                                name="payment_method"
                                                value="Cash in Hand (Office)"
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                                            />
                                            <label htmlFor="cash_in_hand" className="ml-3 block text-sm font-medium text-white">Cash in Hand (Office)</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="rocket"
                                                name="payment_method"
                                                value="Rocket (Send Money) : 018304502805"
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                                            />
                                            <label htmlFor="rocket" className="ml-3 block text-sm font-medium text-white">Rocket (Send Money) : 018304502805</label>
                                        </div>
                                    </div>
                                    {errors.payment_method && <div className="text-red-500 text-sm mt-1">{errors.payment_method}</div>}
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
                                        value={data.bach_interested}
                                        onChange={(e) => setData('bach_interested', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    >
                                        <option value="">ব্যাচ নির্বাচন করুন</option>
                                        {bach.map((course, index) => (
                                            <option key={index} value={course}>{course}</option>
                                        ))}
                                    </select>
                                    {errors.course_interested && <div className="text-red-500 text-sm mt-1">{errors.course_interested}</div>}
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
                                        value={data.representative_name}
                                        onChange={(e) => setData('representative_name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                                        required
                                    >
                                        <option value="">Select a Representative</option>
                                        {representatives.map((rep, index) => (
                                            <option key={index} value={rep}>{rep}</option>
                                        ))}
                                    </select>
                                    {errors.representative_name && <div className="text-red-500 text-sm mt-1">{errors.representative_name}</div>}
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