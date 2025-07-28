import React from 'react';

export default function UserForm({ data, setData, errors, roles }) {
    const handleRoleChange = (e) => {
        const { options } = e.target;
        const selectedRoles = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedRoles.push(parseInt(options[i].value));
            }
        }
        setData('roles', selectedRoles);
    };

    return (
        <>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
                <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                <input
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                />
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                <input
                    type="password"
                    id="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                />
                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-white">Confirm Password</label>
                <input
                    type="password"
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                />
                {errors.password_confirmation && <div className="text-red-500 text-sm mt-1">{errors.password_confirmation}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="roles" className="block text-sm font-medium text-white">Roles</label>
                <select
                    id="roles"
                    multiple
                    value={data.roles}
                    onChange={handleRoleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 h-32"
                >
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                </select>
                {errors.roles && <div className="text-red-500 text-sm mt-1">{errors.roles}</div>}
            </div>
        </>
    );
}
