import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    CogIcon,
    ArrowRightStartOnRectangleIcon,
    XMarkIcon, // For the close button
    Squares2X2Icon,
    AcademicCapIcon,
    BuildingOfficeIcon,
    BanknotesIcon,
    ChevronDownIcon,
    RectangleStackIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';

const NavLink = ({ href, active, children, icon: Icon }) => (
    <Link
        href={href}
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 group ${
            active
                ? 'bg-maroon/30 text-white shadow-lg animate-glow' // Maroon accent for active
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
        } border border-white/10 backdrop-blur-sm`} // Glassmorphism border
    >
        <Icon className="mr-3 flex-shrink-0 h-6 w-6 text-gray-300 group-hover:text-white" />
        {children}
    </Link>
);

const DropdownLink = ({ title, children, icon: Icon, active }) => {
    const [isOpen, setIsOpen] = useState(active);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-left text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-all duration-300 group border border-white/10 backdrop-blur-sm"
            >
                <span className="flex items-center">
                    <Icon className="mr-3 flex-shrink-0 h-6 w-6 text-gray-300 group-hover:text-white" />
                    {title}
                </span>
                <ChevronDownIcon
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-screen' : 'max-h-0'
                }`}
            >
                <div className="pl-8 pr-2 py-2 space-y-1">{children}</div>
            </div>
        </div>
    );
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const { auth, settings } = usePage().props;
    const user = auth.user;
    const currentRoute = route().current();

    const isActive = (routeName) => currentRoute.startsWith(routeName);

    return (
        <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
                        aria-hidden="true"
                        onClick={() => setSidebarOpen(false)} // Close on backdrop click
                    ></div>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full  backdrop-blur-xl border-r border-white/10 pt-5 pb-4 shadow-xl">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </button>
                        </div>
                        {/* Sidebar content */}
                        <div className="flex items-center flex-shrink-0 px-4">
                            <Link href="/" className="flex items-center space-x-3">
                                <img className="h-10 w-auto" src="/images/logo.png" alt="Logo" />
                                
                            </Link>
                        </div>
                        <div className="mt-8 flex-grow">
                            <nav className="px-4 space-y-2">
                                <NavLink href={route('dashboard')} active={isActive('dashboard')} icon={HomeIcon}>
                                    Dashboard
                                </NavLink>

                                {user.permissions?.includes('crud-builder-access') && (
                                    <NavLink href={route('crud.builder')} active={isActive('crud.builder')} icon={Squares2X2Icon}>
                                        CRUD Builder
                                    </NavLink>
                                )}

                                {user.permissions?.some(p => ['manage-users', 'manage-roles', 'manage-permissions', 'manage-settings'].includes(p)) && (
                                    <DropdownLink title="Admin Panel" icon={CogIcon} active={isActive('admin')}>
                                        {user.permissions?.includes('manage-users') && <NavLink href={route('admin.users')} active={isActive('admin.users')} icon={UsersIcon}>Users</NavLink>}
                                        {user.permissions?.includes('manage-roles') && <NavLink href={route('admin.roles')} active={isActive('admin.roles')} icon={UserGroupIcon}>Roles</NavLink>}
                                        {user.permissions?.includes('manage-permissions') && <NavLink href={route('admin.permissions')} active={isActive('admin.permissions')} icon={UserGroupIcon}>Permissions</NavLink>}
                                        {user.permissions?.includes('manage-settings') && <NavLink href={route('admin.settings.index')} active={isActive('admin.settings.index')} icon={CogIcon}>Settings</NavLink>}
                                    </DropdownLink>
                                )}

                                {user.permissions?.includes('manage-students') && (
                                    <NavLink href={route('admin.students.index')} active={isActive('admin.students.index')} icon={AcademicCapIcon}>
                                        Students
                                    </NavLink>
                                )}

                                {user.permissions?.includes('manage-courses') && (
                                    <NavLink href={route('admin.courses.index')} active={isActive('admin.courses.index')} icon={RectangleStackIcon}>
                                        Courses
                                    </NavLink>
                                )}

                                {user.permissions?.includes('manage-batches') && (
                                    <NavLink href={route('admin.batches.index')} active={isActive('admin.batches.index')} icon={BuildingOfficeIcon}>
                                        Batches
                                    </NavLink>
                                )}

                                {user.permissions?.includes('paymentmethods_view') && (
                                    <NavLink href={route('paymentmethods.index')} active={isActive('paymentmethods.index')} icon={BanknotesIcon}>
                                        Payment Methods
                                    </NavLink>
                                )}

                                {user.permissions?.includes('representatives_view') && (
                                    <NavLink href={route('representatives.index')} active={isActive('representatives.index')} icon={UserGroupIcon}>
                                        Representatives
                                    </NavLink>
                                )}
                            </nav>
                        </div>
                        <div className="border-t border-white/10 p-4">
                            <div className="flex items-center">
                                <img className="h-10 w-10 rounded-full border border-white/20" src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="User Avatar" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                    <Link href={route('profile.edit')} className="text-xs text-gray-400 hover:text-white">
                                        View Profile
                                    </Link>
                                </div>
                                <Link href={route('logout')} method="post" as="button" className="ml-auto text-gray-400 hover:text-white">
                                    <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex flex-col flex-grow  backdrop-blur-xl border-r border-white/10 pt-[34px] overflow-y-auto shadow-lg">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <Link href="/" className="flex items-center space-x-3">
                            <img className="h-[65px] w-[500px]" src="/images/logo.png" alt="Logo" />
                        </Link>
                    </div>
                    <div className="mt-8 flex-grow">
                        <nav className="px-4 space-y-2">
                            <NavLink href={route('dashboard')} active={isActive('dashboard')} icon={HomeIcon}>
                                Dashboard
                            </NavLink>

                            {user.permissions?.includes('crud-builder-access') && (
                                <NavLink href={route('crud.builder')} active={isActive('crud.builder')} icon={Squares2X2Icon}>
                                    CRUD Builder
                                </NavLink>
                            )}

                            {user.permissions?.some(p => ['manage-users', 'manage-roles', 'manage-permissions', 'manage-settings'].includes(p)) && (
                                <DropdownLink title="Admin Panel" icon={CogIcon} active={isActive('admin')}>
                                    {user.permissions?.includes('manage-users') && <NavLink href={route('admin.users')} active={isActive('admin.users')} icon={UsersIcon}>Users</NavLink>}
                                    {user.permissions?.includes('manage-roles') && <NavLink href={route('admin.roles')} active={isActive('admin.roles')} icon={UserGroupIcon}>Roles</NavLink>}
                                    {user.permissions?.includes('manage-permissions') && <NavLink href={route('admin.permissions')} active={isActive('admin.permissions')} icon={UserGroupIcon}>Permissions</NavLink>}
                                    {user.permissions?.includes('manage-settings') && <NavLink href={route('admin.settings.index')} active={isActive('admin.settings.index')} icon={CogIcon}>Settings</NavLink>}
                                </DropdownLink>
                            )}

                            {user.permissions?.includes('manage-students') && (
                                <NavLink href={route('admin.students.index')} active={isActive('admin.students.index')} icon={AcademicCapIcon}>
                                    Students
                                </NavLink>
                            )}

                            {user.permissions?.includes('manage-courses') && (
                                <NavLink href={route('admin.courses.index')} active={isActive('admin.courses.index')} icon={RectangleStackIcon}>
                                    Courses
                                </NavLink>
                            )}

                            {user.permissions?.includes('manage-batches') && (
                                <NavLink href={route('admin.batches.index')} active={isActive('admin.batches.index')} icon={BuildingOfficeIcon}>
                                    Batches
                                </NavLink>
                            )}

                            {user.permissions?.includes('paymentmethods_view') && (
                                <NavLink href={route('paymentmethods.index')} active={isActive('paymentmethods.index')} icon={BanknotesIcon}>
                                    Payment Methods
                                </NavLink>
                            )}

                            {user.permissions?.includes('representatives_view') && (
                                <NavLink href={route('representatives.index')} active={isActive('representatives.index')} icon={UserGroupIcon}>
                                    Representatives
                                </NavLink>
                            )}
                        </nav>
                    </div>
                    <div className="border-t border-white/10 p-4">
                        <div className="flex items-center">
                            <img className="h-10 w-10 rounded-full border border-white/20" src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="User Avatar" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <Link href={route('profile.edit')} className="text-xs text-gray-400 hover:text-white">
                                    View Profile
                                </Link>
                            </div>
                            <Link href={route('logout')} method="post" as="button" className="ml-auto text-gray-400 hover:text-white">
                                <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
