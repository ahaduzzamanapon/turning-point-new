import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function Settings({ auth, settings }) {
    const { data, setData, processing } = useForm({
        sidebar_color: settings.sidebar_color || '#333333',
        sidebar_text_color: settings.sidebar_text_color || '#ffffff',
        admin_header_color: settings.admin_header_color || '#ffffff',
        admin_header_text_color: settings.admin_header_text_color || '#333333',
        font_family: settings.font_family || 'Inter',
        app_name: settings.app_name || 'Gemini CRUD',
        logo: null, // Initialize logo as null for file input
    });

    const fontFamilies = [
        'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro',
        'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Lucida Console',
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in data) {
            if (key === 'logo' && data[key] === null) {
                // Skip if logo is null (no new file selected)
                continue;
            }
            formData.append(key, data[key]);
        }
        formData.append('_method', 'put'); // Spoof PUT method

        Inertia.post(route('admin.settings.update'), formData, {
            onSuccess: () => {
                Inertia.reload({ only: ['settings'] }); // Reload only settings prop
            },
            onError: (errors) => {
                console.error('Error saving settings:', errors);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Settings</h2>}
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <h3 className="text-lg font-medium text-white mb-4">Application Settings</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="app_name" className="block text-sm font-medium text-white">App Name</label>
                                    <input
                                        type="text"
                                        id="app_name"
                                        value={data.app_name}
                                        onChange={(e) => setData('app_name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="sidebar_color" className="block text-sm font-medium text-white">Sidebar Color</label>
                                    <input
                                        type="color"
                                        id="sidebar_color"
                                        value={data.sidebar_color}
                                        onChange={(e) => setData('sidebar_color', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 h-10"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="sidebar_text_color" className="block text-sm font-medium text-white">Sidebar Text Color</label>
                                    <input
                                        type="color"
                                        id="sidebar_text_color"
                                        value={data.sidebar_text_color}
                                        onChange={(e) => setData('sidebar_text_color', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 h-10"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="admin_header_color" className="block text-sm font-medium text-white">Admin Header Color</label>
                                    <input
                                        type="color"
                                        id="admin_header_color"
                                        value={data.admin_header_color}
                                        onChange={(e) => setData('admin_header_color', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 h-10"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="admin_header_text_color" className="block text-sm font-medium text-white">Admin Header Text Color</label>
                                    <input
                                        type="color"
                                        id="admin_header_text_color"
                                        value={data.admin_header_text_color}
                                        onChange={(e) => setData('admin_header_text_color', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 h-10"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="font_family" className="block text-sm font-medium text-white">Font Family</label>
                                    <select
                                        id="font_family"
                                        value={data.font_family}
                                        onChange={(e) => setData('font_family', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                                    >
                                        {fontFamilies.map(font => (
                                            <option key={font} value={font}>{font}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="logo" className="block text-sm font-medium text-white">App Logo</label>
                                    <input
                                        type="file"
                                        id="logo"
                                        onChange={(e) => setData('logo', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {settings.logo && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">Current Logo:</p>
                                            <img src={settings.logo} alt="Current Logo" className="mt-1 h-20 w-auto object-contain" />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={processing}
                                    >
                                        Save Settings
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