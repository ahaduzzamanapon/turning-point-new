import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function CrudBuilder({ auth, output, jsonConfig }) {
    const { data, setData, post, processing, errors } = useForm({
        modelName: '',
        tableName: '',
        columns: [],
        timestamps: true,
        softDeletes: false,
        onlyMigration: false,
    });

    const addColumn = () => {
        setData('columns', [...data.columns, {
            columnName: '',
            dataType: '',
            inputType: '',
            validationRules: '',
            defaultValue: '',
            nullable: false,
            relationship: '',
        }]);
    };

    const removeColumn = (index) => {
        const newColumns = [...data.columns];
        newColumns.splice(index, 1);
        setData('columns', newColumns);
    };

    const handleColumnChange = (index, field, value) => {
        const newColumns = [...data.columns];
        newColumns[index][field] = value;
        setData('columns', newColumns);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('crud.generate'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">CRUD Builder</h2>}
        >
            <Head title="CRUD Builder" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                        <div className="p-6 text-white">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label htmlFor="modelName" className="block text-sm font-medium text-white">Model Name</label>
                                    <input
                                        type="text"
                                        id="modelName"
                                        value={data.modelName}
                                        onChange={(e) => setData('modelName', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors.modelName && <div className="text-red-500 text-sm mt-1">{errors.modelName}</div>}
                                </div>

                                

                                <h3 className="text-lg font-medium text-white mt-6 mb-4">Columns</h3>
                                {data.columns.map((column, index) => (
                                    <div key={index} className="grid grid-cols-6 gap-4 mb-4 p-4 border rounded-md">
                                        <div>
                                            <label className="block text-sm font-medium text-white">Column Name</label>
                                            <input
                                                type="text"
                                                value={column.columnName}
                                                onChange={(e) => handleColumnChange(index, 'columnName', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white">Data Type</label>
                                            <select
                                                value={column.dataType}
                                                onChange={(e) => handleColumnChange(index, 'dataType', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="string">String</option>
                                                <option value="integer">Integer</option>
                                                <option value="text">Text</option>
                                                <option value="boolean">Boolean</option>
                                                <option value="date">Date</option>
                                                <option value="datetime">DateTime</option>
                                                <option value="float">Float</option>
                                                <option value="json">JSON</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white">Input Type</label>
                                            <select
                                                value={column.inputType}
                                                onChange={(e) => handleColumnChange(index, 'inputType', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="text">Text</option>
                                                <option value="email">Email</option>
                                                <option value="number">Number</option>
                                                <option value="password">Password</option>
                                                <option value="textarea">Textarea</option>
                                                <option value="checkbox">Checkbox</option>
                                                <option value="radio">Radio</option>
                                                <option value="select">Select</option>
                                                <option value="date">Date</option>
                                                <option value="datetime-local">DateTime Local</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white">Validation Rules</label>
                                            <input
                                                type="text"
                                                value={column.validationRules}
                                                onChange={(e) => handleColumnChange(index, 'validationRules', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white">Default Value</label>
                                            <input
                                                type="text"
                                                value={column.defaultValue}
                                                onChange={(e) => handleColumnChange(index, 'defaultValue', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={column.nullable}
                                                onChange={(e) => handleColumnChange(index, 'nullable', e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            />
                                            <label className="ml-2 block text-sm font-medium text-white">Nullable</label>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white">Relationship</label>
                                            <select
                                                value={column.relationship}
                                                onChange={(e) => handleColumnChange(index, 'relationship', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 bg-black/30 backdrop-blur-xl border border-white/10"
                                            >
                                                <option value="">None</option>
                                                <option value="belongsTo">Belongs To</option>
                                                <option value="hasMany">Has Many</option>
                                                <option value="hasOne">Has One</option>
                                            </select>
                                        </div>
                                        <div className="col-span-6 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeColumn(index)}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                Remove Column
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addColumn}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Column
                                </button>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="timestamps"
                                            checked={data.timestamps}
                                            onChange={(e) => setData('timestamps', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <label htmlFor="timestamps" className="ml-2 block text-sm font-medium text-white">Timestamps</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="softDeletes"
                                            checked={data.softDeletes}
                                            onChange={(e) => setData('softDeletes', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <label htmlFor="softDeletes" className="ml-2 block text-sm font-medium text-white">Soft Deletes</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="onlyMigration"
                                            checked={data.onlyMigration}
                                            onChange={(e) => setData('onlyMigration', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <label htmlFor="onlyMigration" className="ml-2 block text-sm font-medium text-white">Only Migration</label>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        disabled={processing}
                                    >
                                        Generate CRUD
                                    </button>
                                </div>
                            </form>

                            {output && (
                                <div className="mt-6 p-4 bg-gray-100 rounded-md">
                                    <h3 className="text-lg font-medium text-white">Generation Output:</h3>
                                    <pre className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">{output}</pre>
                                </div>
                            )}

                            {jsonConfig && (
                                <div className="mt-6 p-4 bg-gray-100 rounded-md">
                                    <h3 className="text-lg font-medium text-white">Generated JSON Config:</h3>
                                    <pre className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">{jsonConfig}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}