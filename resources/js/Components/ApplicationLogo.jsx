import React from 'react';
import { usePage } from '@inertiajs/react';

export default function ApplicationLogo({ className }) {
    const { settings } = usePage().props;

    // If a logo URL is provided in settings, use it
    if (settings && settings.logo) {
        return <img src={settings.logo} alt={settings.app_name || 'App Logo'} className={className} />;
    }

    // Fallback to app name text if no logo is provided
    return (
        <span className={className}>
            {settings.app_name || 'App'}
        </span>
    );
}
