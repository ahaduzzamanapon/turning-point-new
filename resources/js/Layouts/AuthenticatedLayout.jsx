import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar'; // Import the new Sidebar component
import { Bars3Icon } from '@heroicons/react/24/outline'; // Only Bars3Icon needed here

export default function AuthenticatedLayout({ header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen"> {/* Background handled by app.css */}
            {/* Mobile sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="md:pl-64 flex flex-col flex-1">
                {/* Mobile sidebar toggle */}
                <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3  backdrop-blur-md border-b border-white/10">
                    <button
                        type="button"
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-maroon"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <main className="flex-1 p-4 md:p-8">
                    {header && (
                        <header className=" dark: backdrop-blur-xl shadow-lg rounded-xl mb-8 border border-white/10"> {/* Transparent header */}
                            <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 text-white"> {/* Text color for header */}
                                {header}
                            </div>
                        </header>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}