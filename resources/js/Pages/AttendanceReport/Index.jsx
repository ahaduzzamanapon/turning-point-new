import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EmployeeSelector from '@/Components/EmployeeSelector'; // Assuming this component will be created
import DailyAttendance from './DailyAttendance'; // Assuming this component will be created
import MonthlyAttendance from './MonthlyAttendance'; // Assuming this component will be created
import ContinuousAttendance from './ContinuousAttendance'; // Assuming this component will be created

export default function Index({ auth }) {
    const [selectedTab, setSelectedTab] = useState('daily');
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const handleEmployeeSelection = (employees) => {
        setSelectedEmployees(employees);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Attendance Report</h2>}
        >
            <Head title="Attendance Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex">
                                {/* Main Content Area */}
                                <div className="w-3/4 pr-4">
                                    {/* Tab Navigation */}
                                    <div className="mb-4 border-b border-gray-200">
                                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="attendance-tabs" role="tablist">
                                            <li className="mr-2" role="presentation">
                                                <button
                                                    className={`inline-block p-4 border-b-2 rounded-t-lg ${selectedTab === 'daily' ? 'text-blue-600 border-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}`}
                                                    onClick={() => setSelectedTab('daily')}
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="daily"
                                                    aria-selected={selectedTab === 'daily'}
                                                >
                                                    Daily
                                                </button>
                                            </li>
                                            <li className="mr-2" role="presentation">
                                                <button
                                                    className={`inline-block p-4 border-b-2 rounded-t-lg ${selectedTab === 'monthly' ? 'text-blue-600 border-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}`}
                                                    onClick={() => setSelectedTab('monthly')}
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="monthly"
                                                    aria-selected={selectedTab === 'monthly'}
                                                >
                                                    Monthly
                                                </button>
                                            </li>
                                            <li className="mr-2" role="presentation">
                                                <button
                                                    className={`inline-block p-4 border-b-2 rounded-t-lg ${selectedTab === 'continuous' ? 'text-blue-600 border-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}`}
                                                    onClick={() => setSelectedTab('continuous')}
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="continuous"
                                                    aria-selected={selectedTab === 'continuous'}
                                                >
                                                    Continuous
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Tab Content */}
                                    <div id="attendance-tab-content">
                                        {selectedTab === 'daily' && <DailyAttendance selectedEmployees={selectedEmployees} />}
                                        {selectedTab === 'monthly' && <MonthlyAttendance selectedEmployees={selectedEmployees} />}
                                        {selectedTab === 'continuous' && <ContinuousAttendance selectedEmployees={selectedEmployees} />}
                                    </div>
                                </div>

                                {/* Employee Selection Panel */}
                                <div className="w-1/4 pl-4 border-l border-gray-200">
                                    <EmployeeSelector onSelectEmployees={handleEmployeeSelection} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
