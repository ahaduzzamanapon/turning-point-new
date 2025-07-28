import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to Turning Point Job Aid" />
            <div className="min-h-screen text-white antialiased font-sans"> {/* Removed bg-gray-50 */}
                {/* Navigation */}
                <nav className="bg-black/50 backdrop-blur-md shadow-lg py-4 px-6 flex justify-between items-center sticky top-0 z-50 border-b border-white/10"> {/* Transparent nav */}
                    <div className="flex items-center">
                        <span className="text-2xl font-extrabold text-maroon">Turning Point Job Aid</span> {/* Maroon accent */}
                    </div>
                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="font-semibold text-white hover:text-maroon transition duration-300"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-white hover:text-maroon transition duration-300"
                                >
                                    Log in
                                </Link>

                                {/* <Link
                                    href={route('register')}
                                    className="ml-4 font-semibold text-white hover:text-maroon transition duration-300"
                                >
                                    Register
                                </Link> */}
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="relative bg-black/50 backdrop-blur-md text-white py-24 md:py-32 text-center overflow-hidden border-b border-white/10"> {/* Transparent hero */}
                    <div className="absolute inset-0 bg-gradient-to-r from-maroon/50 to-black/50 opacity-80"></div> {/* Maroon gradient overlay */}
                    <div className="relative z-10 max-w-4xl mx-auto px-4">
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
                            Unlock Your Future with Expert Coaching
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 opacity-90 animate-fade-in-up delay-200">
                            Specialized training for Bank Jobs and competitive exams. Your success starts here.
                        </p>
                        <Link
                            href={route('registration')}
                            className="inline-block bg-maroon text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-maroon/80 transform hover:scale-105 transition duration-300 ease-in-out animate-bounce-in delay-400"
                        >
                            Enroll Now & Secure Your Seat!
                        </Link>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* About Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 animate-fade-in-up">
                        <div className="bg-black/30 backdrop-blur-xl p-8 rounded-xl shadow-lg border border-white/10"> {/* Transparent card */}
                            <h2 className="text-4xl font-bold text-maroon mb-6">About Turning Point Job Aid</h2>
                            <p className="text-white leading-relaxed text-lg mb-4">
                                Welcome to Turning Point Job Aid! We are dedicated to providing top-notch coaching for various competitive exams, especially focusing on Bank Job preparations. Our experienced faculty, comprehensive study materials, and proven methodologies ensure that every student is well-equipped to achieve their career goals.
                            </p>
                            <p className="text-white leading-relaxed text-lg">
                                We offer specialized courses designed to cover all aspects of competitive exams, including:
                                <ul className="list-disc list-inside ml-6 mt-4 space-y-2 text-gray-300"> {/* Adjusted text color */}
                                    <li>Mathematics & Reasoning</li>
                                    <li>English Language & Literature</li>
                                    <li>General Knowledge & Current Affairs</li>
                                    <li>Computer & IT Skills</li>
                                </ul>
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-black/30 backdrop-blur-xl p-8 rounded-xl shadow-lg border border-white/10"> {/* Transparent card */}
                            <h2 className="text-4xl font-bold text-maroon mb-6">Get in Touch</h2>
                            <p className="text-white mb-3 text-lg">
                                <strong>Head Office:</strong> 12, Akhanda Tower (Lift- 4), Falpatti Goli, Opposite the Mosque, Mirpur- 10, Dhaka
                            </p>
                            <p className="text-white mb-3 text-lg">
                                <strong>Call:</strong> <a href="tel:01896224210" className="text-maroon hover:underline">01896224210</a> / <a href="tel:01896224211" className="text-maroon hover:underline">01896224211</a>
                            </p>
                            <p className="text-white mb-3 text-lg">
                                <strong>Email:</strong> <a href="mailto:turningpointjobaid@gmail.com" className="text-maroon hover:underline">turningpointjobaid@gmail.com</a>
                            </p>
                            <p className="text-white mb-3 text-lg">
                                <strong>Facebook:</strong> <a href="https://www.facebook.com/turningpointjobaid" target="_blank" rel="noopener noreferrer" className="text-maroon hover:underline">Turning Point Job Aid Page</a>
                            </p>
                        </div>
                    </section>

                    {/* Our Courses Section */}
                    <section className="py-16 bg-black/30 backdrop-blur-xl rounded-xl shadow-lg mb-16 animate-fade-in-up delay-100 border border-white/10"> {/* Transparent card */}
                        <h2 className="text-4xl font-bold text-maroon text-center mb-10">Our Specialized Courses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                            <div className="bg-black/20 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 border border-white/10"> {/* Transparent card */}
                                <div className="text-maroon text-5xl mb-4 text-center">🏦</div>
                                <h3 className="text-xl font-semibold text-white mb-2 text-center">Bank Job Preparation</h3>
                                <p className="text-gray-300 text-center">Comprehensive coaching for all government and private bank exams.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 border border-white/10"> {/* Transparent card */}
                                <div className="text-maroon text-5xl mb-4 text-center">✍️</div>
                                <h3 className="text-xl font-semibold text-white mb-2 text-center">Premium Written Batch</h3>
                                <p className="text-gray-300 text-center">Focused training for the written examination phase of bank jobs.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 border border-white/10"> {/* Transparent card */}
                                <div className="text-maroon text-5xl mb-4 text-center">💻</div>
                                <h3 className="text-xl font-semibold text-white mb-2 text-center">IT Special Batch</h3>
                                <p className="text-gray-300 text-center">Specialized IT training for bank job aspirants.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 border border-white/10"> {/* Transparent card */}
                                <div className="text-maroon text-5xl mb-4 text-center">➕</div>
                                <h3 className="text-xl font-semibold text-white mb-2 text-center">Basic Math & English</h3>
                                <p className="text-gray-300 text-center">Strengthen your fundamentals in Mathematics and English.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 border border-white/10"> {/* Transparent card */}
                                <div className="text-maroon text-5xl mb-4 text-center">🚀</div>
                                <h3 className="text-xl font-semibold text-white mb-2 text-center">O.G Crash Course</h3>
                                <p className="text-gray-300 text-center">Intensive crash course for quick and effective preparation.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 border border-white/10"> {/* Transparent card */}
                                <div className="text-maroon text-5xl mb-4 text-center">🗓️</div>
                                <h3 className="text-xl font-semibold text-white mb-2 text-center">Upcoming Batches</h3>
                                <p className="text-gray-300 text-center">Stay tuned for our new batches, including 24th Batch (8 PM).</p>
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us Section */}
                    <section className="text-center py-16 bg-black/30 backdrop-blur-xl rounded-xl shadow-lg mb-16 animate-fade-in-up delay-200 border border-white/10"> {/* Transparent card */}
                        <h2 className="text-4xl font-bold text-maroon mb-10">Why Choose Us?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                            <div className="p-6 bg-black/20 rounded-lg shadow-md transform hover:scale-105 transition duration-300 border border-white/10"> {/* Transparent card */}
                                <div className="text-maroon text-5xl mb-4">💡</div>
                                <h3 className="text-xl font-semibold text-white mb-2">Expert Faculty</h3>
                                <p className="text-gray-300">Learn from highly experienced and dedicated educators.</p>
                            </div>
                            <div className="p-6 bg-black/20 rounded-lg shadow-md transform hover:scale-105 transition duration-300 border border-white/10"> {/* Transparent card */}
                                <div className="text-maroon text-5xl mb-4">📚</div>
                                <h3 className="text-xl font-semibold text-white mb-2">Comprehensive Materials</h3>
                                <p className="text-gray-300">Access well-researched and up-to-date study resources.</p>
                            </div>
                            <div className="p-6 bg-black/20 rounded-lg shadow-md transform hover:scale-105 transition duration-300 border border-white/10"> {/* Transparent card */}
                                <div className="text-maroon text-5xl mb-4">🎯</div>
                                <h3 className="text-xl font-semibold text-white mb-2">Proven Success</h3>
                                <p className="text-gray-300">Join a community with a strong track record of student achievements.</p>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className="py-16 text-center animate-fade-in-up delay-300">
                        <h2 className="text-4xl font-bold text-maroon mb-10">What Our Students Say</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-black/30 backdrop-blur-xl p-6 rounded-lg shadow-md border border-white/10"> {/* Transparent card */}
                                <p className="italic text-white mb-4">"Turning Point Job Aid transformed my career prospects. The guidance was invaluable!"</p>
                                <p className="font-semibold text-white">- A Satisfied Student</p>
                            </div>
                            <div className="bg-black/30 backdrop-blur-xl p-6 rounded-lg shadow-md border border-white/10"> {/* Transparent card */}
                                <p className="italic text-white mb-4">"The comprehensive study materials and mock tests were key to my success."</p>
                                <p className="font-semibold text-white">- Another Happy Learner</p>
                            </div>
                            <div className="bg-black/30 backdrop-blur-xl p-6 rounded-lg shadow-md border border-white/10"> {/* Transparent card */}
                                <p className="italic text-white mb-4">"Highly recommend for anyone serious about cracking bank exams."</p>
                                <p className="font-semibold text-white">- Future Banker</p>
                            </div>
                        </div>
                    </section>

                    {/* Final Call to Action */}
                    <section className="bg-maroon text-white py-20 text-center mt-16 rounded-xl shadow-lg animate-fade-in-up delay-400"> {/* Maroon background for CTA */}
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Start Your Journey?</h2>
                        <p className="text-xl md:text-2xl mb-10 opacity-90">Join hundreds of successful students. Enroll today!</p>
                        <Link
                            href={route('registration')}
                            className="inline-block bg-white text-maroon px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-gray-200 transform hover:scale-105 transition duration-300 ease-in-out"
                        >
                            Register Now
                        </Link>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-black/50 backdrop-blur-md text-white py-8 text-center mt-16 border-t border-white/10"> {/* Transparent footer */}
                    <div className="max-w-7xl mx-auto px-4">
                        <p>&copy; {new Date().getFullYear()} Turning Point Job Aid. All rights reserved.</p>
                        <p className="mt-2 text-sm">Head Office: 12, Akhanda Tower (Lift- 4), Falpatti Goli, Opposite the Mosque, Mirpur- 10, Dhaka</p>
                    </div>
                </footer>
            </div>
        </>
    );
}