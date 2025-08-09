import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';
import {
    DocumentArrowDownIcon,
    MagnifyingGlassIcon,
    AcademicCapIcon,
    CalendarDaysIcon,
    ArrowPathIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ArrowDownTrayIcon,
    PrinterIcon
} from '@heroicons/react/24/outline';

const statusOptions = [
    { value: 'all', label: 'All Admissions' },
    { value: 'confirmed', label: 'Confirmed Only' },
    { value: 'pending', label: 'Pending Only' },
    { value: 'cancelled', label: 'Cancelled Only' },
];

const Table = ({ data, columns, title }) => {
    if (!data || data.length === 0) {
        return <p className="text-gray-600">No data available for {title}.</p>;
    }

    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
            <h3 className="text-lg font-semibold mb-2 px-4 pt-4">{title}</h3>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-6 py-4">
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default function StudentAdmissionReport({ auth }) {
    const [activeTab, setActiveTab] = useState('daily');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [statusFilter, setStatusFilter] = useState(statusOptions[0]);
    const [dailyReportData, setDailyReportData] = useState([]);
    const [monthlyReportData, setMonthlyReportData] = useState(null);
    const [continuousReportData, setContinuousReportData] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchAllStudents();
    }, []);

    useEffect(() => {
        if (activeTab === 'daily') {
            fetchDailyReport();
        } else if (activeTab === 'monthly') {
            fetchMonthlyReport();
        } else if (activeTab === 'continuous') {
            fetchContinuousReport();
        }
    }, [activeTab, selectedDate, selectedMonth, fromDate, toDate, statusFilter, selectedStudents]);

    const fetchAllStudents = async () => {
        try {
            const response = await axios.get(route('api.students.all'));
            setAllStudents(response.data);
        } catch (error) {
            console.error("Error fetching all students:", error);
        }
    };

    const fetchDailyReport = async () => {
        setLoading(true);
        setErrors({});
        try {
            const response = await axios.get(route('api.reports.student-admission.daily'), {
                params: {
                    date: selectedDate.toISOString().split('T')[0],
                    status: statusFilter.value,
                    student_ids: selectedStudents.map(s => s.id),
                },
            });
            setDailyReportData(response.data);
        } catch (error) {
            setErrors(error.response?.data?.errors || { message: 'Failed to fetch daily report.' });
            console.error("Error fetching daily report:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthlyReport = async () => {
        setLoading(true);
        setErrors({});
        try {
            const response = await axios.get(route('api.reports.student-admission.monthly'), {
                params: {
                    month: selectedMonth.toISOString().slice(0, 7),
                    student_ids: selectedStudents.map(s => s.id),
                },
            });
            setMonthlyReportData(response.data);
        } catch (error) {
            setErrors(error.response?.data?.errors || { message: 'Failed to fetch monthly report.' });
            console.error("Error fetching monthly report:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchContinuousReport = async () => {
        setLoading(true);
        setErrors({});
        try {
            const response = await axios.get(route('api.reports.student-admission.continuous'), {
                params: {
                    from_date: fromDate.toISOString().split('T')[0],
                    to_date: toDate.toISOString().split('T')[0],
                    status: statusFilter.value,
                    student_ids: selectedStudents.map(s => s.id),
                },
            });
            setContinuousReportData(response.data);
        } catch (error) {
            setErrors(error.response?.data?.errors || { message: 'Failed to fetch continuous report.' });
            console.error("Error fetching continuous report:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSelection = (student) => {
        setSelectedStudents(prev =>
            prev.some(s => s.id === student.id)
                ? prev.filter(s => s.id !== student.id)
                : [...prev, student]
        );
    };

    const filteredStudents = allStudents.filter(student =>
        student.name?.toLowerCase().includes(searchTermLower) ||
        student.phone?.toLowerCase().includes(searchTermLower) ||
        student.email?.toLowerCase().includes(searchTermLower) ||
        student.address?.toLowerCase().includes(searchTermLower) ||
        student.course?.name?.toLowerCase().includes(searchTermLower) ||
        student.batch?.name?.toLowerCase().includes(searchTermLower) ||
        student.representative?.name?.toLowerCase().includes(searchTermLower) ||
        student.payment_method?.name?.toLowerCase().includes(searchTermLower)
    );

    const dailyColumns = [
        { header: 'Student Name', accessor: 'candidate_full_name' },
        { header: 'Mobile Number', accessor: 'mobile_number' },
        { header: 'Admission Date', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A' },
        { header: 'Program Name', render: (row) => row.course?.name || 'N/A' },
        { header: 'Admission Status', render: (row) => {
            let colorClass = '';
            let icon = null;
            if (row.registration_status === 'confirmed') {
                colorClass = 'text-green-600';
                icon = <CheckCircleIcon className="h-5 w-5 inline-block mr-1" />;
            } else if (row.registration_status === 'pending') {
                colorClass = 'text-yellow-600';
                icon = <ClockIcon className="h-5 w-5 inline-block mr-1" />;
            } else if (row.registration_status === 'cancelled') {
                colorClass = 'text-red-600';
                icon = <XCircleIcon className="h-5 w-5 inline-block mr-1" />;
            }
            return <span className={colorClass}>{icon}{row.registration_status}</span>;
        }},
    ];

    const monthlyColumns = [
        { header: 'Metric', accessor: 'metric' },
        { header: 'Count', accessor: 'count' },
    ];

    const continuousColumns = [
        { header: 'Student Name', accessor: 'candidate_full_name' },
        { header: 'Mobile Number', accessor: 'mobile_number' },
        { header: 'Admission Date', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A' },
        { header: 'Program Name', render: (row) => row.course?.name || 'N/A' },
        { header: 'Admission Status', render: (row) => {
            let colorClass = '';
            let icon = null;
            if (row.registration_status === 'confirmed') {
                colorClass = 'text-green-600';
                icon = <CheckCircleIcon className="h-5 w-5 inline-block mr-1" />;
            } else if (row.registration_status === 'pending') {
                colorClass = 'text-yellow-600';
                icon = <ClockIcon className="h-5 w-5 inline-block mr-1" />;
            } else if (row.registration_status === 'cancelled') {
                colorClass = 'text-red-600';
                icon = <XCircleIcon className="h-5 w-5 inline-block mr-1" />;
            }
            return <span className={colorClass}>{icon}{row.registration_status}</span>;
        }},
    ];

    const exportReport = async (type) => {
        try {
            let url = '';
            let filename = 'student_admission_report';
            const params = {};

            if (activeTab === 'daily') {
                url = route('api.reports.student-admission.daily.export');
                params.date = selectedDate.toISOString().split('T')[0];
                params.status = statusFilter.value;
                params.student_ids = selectedStudents.map(s => s.id);
                filename += `_daily_${params.date}`;
            } else if (activeTab === 'monthly') {
                url = route('api.reports.student-admission.monthly.export');
                params.month = selectedMonth.toISOString().slice(0, 7);
                params.student_ids = selectedStudents.map(s => s.id);
                filename += `_monthly_${params.month}`;
            } else if (activeTab === 'continuous') {
                url = route('api.reports.student-admission.continuous.export');
                params.from_date = fromDate.toISOString().split('T')[0];
                params.to_date = toDate.toISOString().split('T')[0];
                params.status = statusFilter.value;
                params.student_ids = selectedStudents.map(s => s.id);
                filename += `_continuous_${params.from_date}_${params.to_date}`;
            }

            const response = await axios.get(url, {
                params,
                responseType: 'blob', // Important for downloading files
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${filename}.${type}`;
            link.click();
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Error exporting report:", error);
            alert('Failed to export report.');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Student Admission Report</h2>}
        >
            <Head title="Student Admission Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Report Filters</h3>
                            <div className="flex space-x-2">
                                <PrimaryButton onClick={() => exportReport('xlsx')}><ArrowDownTrayIcon className="h-5 w-5 mr-2" />Export Excel</PrimaryButton>
                                <PrimaryButton onClick={() => exportReport('pdf')}><PrinterIcon className="h-5 w-5 mr-2" />Export PDF</PrimaryButton>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    <button
                                        onClick={() => setActiveTab('daily')}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'daily'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Daily
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('monthly')}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'monthly'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('continuous')}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'continuous'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Custom Date Range
                                    </button>
                                </nav>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2">
                                {activeTab === 'daily' && (
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <InputLabel htmlFor="dailyDate" value="Select Date" />
                                            <DatePicker
                                                id="dailyDate"
                                                selected={selectedDate}
                                                onChange={(date) => setSelectedDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="statusFilter" value="Status" />
                                            <Select
                                                id="statusFilter"
                                                options={statusOptions}
                                                value={statusFilter}
                                                onChange={setStatusFilter}
                                                className="mt-1 block w-full"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        <div className="flex items-end space-x-2">
                                            <PrimaryButton onClick={() => setStatusFilter(statusOptions[0])}>All Admissions</PrimaryButton>
                                            <PrimaryButton onClick={() => setStatusFilter(statusOptions[1])}>Confirmed Only</PrimaryButton>
                                            <PrimaryButton onClick={() => setStatusFilter(statusOptions[2])}>Pending Only</PrimaryButton>
                                            <PrimaryButton onClick={() => setStatusFilter(statusOptions[3])}>Cancelled Only</PrimaryButton>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'monthly' && (
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <InputLabel htmlFor="monthlyMonth" value="Select Month" />
                                            <DatePicker
                                                id="monthlyMonth"
                                                selected={selectedMonth}
                                                onChange={(date) => setSelectedMonth(date)}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'continuous' && (
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <InputLabel htmlFor="fromDate" value="From Date" />
                                            <DatePicker
                                                id="fromDate"
                                                selected={fromDate}
                                                onChange={(date) => setFromDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="toDate" value="To Date" />
                                            <DatePicker
                                                id="toDate"
                                                selected={toDate}
                                                onChange={(date) => setToDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="statusFilterContinuous" value="Status" />
                                            <Select
                                                id="statusFilterContinuous"
                                                options={statusOptions}
                                                value={statusFilter}
                                                onChange={setStatusFilter}
                                                className="mt-1 block w-full"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                    </div>
                                )}

                                {loading && <p className="text-indigo-600 mt-4">Loading report...</p>}
                                {Object.keys(errors).length > 0 && (
                                    <div className="text-red-600 mt-4">
                                        <p>Error:</p>
                                        <ul>
                                            {Object.values(errors).map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'daily' && (
                                    <Table
                                        data={dailyReportData}
                                        columns={dailyColumns}
                                        title="Daily Admission Report"
                                    />
                                )}

                                {activeTab === 'monthly' && monthlyReportData && (
                                    <Table
                                        data={[
                                            { metric: 'Total Admissions', count: monthlyReportData.total_admissions },
                                            { metric: 'Confirmed Admissions', count: monthlyReportData.confirmed_admissions },
                                            { metric: 'Pending Admissions', count: monthlyReportData.pending_admissions },
                                            { metric: 'Cancelled Admissions', count: monthlyReportData.cancelled_admissions },
                                        ]}
                                        columns={monthlyColumns}
                                        title="Monthly Admission Summary"
                                    />
                                )}

                                {activeTab === 'continuous' && (
                                    <Table
                                        data={continuousReportData}
                                        columns={continuousColumns}
                                        title="Custom Date Range Admission Report"
                                    />
                                )}
                            </div>

                            <div className="col-span-1 bg-gray-100 p-4 rounded-lg shadow-inner">
                                <h4 className="text-md font-semibold text-gray-900 mb-3">Select Students</h4>
                                <TextInput
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full mb-3"
                                />
                                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md p-2">
                                    {filteredStudents.length === 0 && <p className="text-gray-700">No students found.</p>}
                                    {filteredStudents.map(student => (
                                        <div key={student.id} className="flex items-center mb-2">
                                            <Checkbox
                                                id={`student-${student.id}`}
                                                name={`student-${student.id}`}
                                                checked={selectedStudents.some(s => s.id === student.id)}
                                                onChange={() => handleStudentSelection(student)}
                                            />
                                            <label htmlFor={`student-${student.id}`} className="ml-2 text-sm text-gray-900 cursor-pointer">
                                                {student.name} ({student.mobile_number})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
