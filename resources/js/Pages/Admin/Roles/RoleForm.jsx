import React from 'react';

export default function RoleForm({ data, setData, errors }) {
    return (
        <>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white">Role Name</label>
                <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white border border-gray-200"
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
            </div>
        </>
    );
}
