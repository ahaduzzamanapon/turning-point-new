import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MonthlyAttendance({ selectedEmployees }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
    const [monthlyAttendanceData, setMonthlyAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMonthlyAttendance();
    }, [selectedMonth, selectedEmployees]);

    const fetchMonthlyAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/reports/attendance/monthly', {
                params: {
                    month: selectedMonth,
                    employees: selectedEmployees.join(','),
                },
            });
            setMonthlyAttendanceData(response.data);
        } catch (err) {
            setError('Failed to fetch monthly attendance.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleExport = async () => {
        try {
            const params = new URLSearchParams({
                month: selectedMonth,
                employees: selectedEmployees.join(','),
            }).toString();
            window.open(`/api/reports/attendance/monthly/export?${params}`, '_blank');
        } catch (err) {
            console.error('Failed to export monthly attendance:', err);
            alert('Failed to export monthly attendance.');
        }
    };

    // Generate month options for the dropdown
    const generateMonthOptions = () => {
        const options = [];
        const today = new Date();
        for (let i = 0; i < 12; i++) { // Last 12 months
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const value = date.toISOString().slice(0, 7);
            const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            options.push(<option key={value} value={value}>{label}</option>);
        }
        return options;
    };

    return (
        <div className="monthly-attendance-tab">
            <h3 className="text-lg font-semibold mb-4">Monthly Attendance</h3>

            <div className="flex items-center space-x-4 mb-4">
                <div>
                    <label htmlFor="month-select" className="block text-sm font-medium text-gray-700">Select Month:</label>
                    <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        {generateMonthOptions()}
                    </select>
                </div>
                <div className="ml-auto">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600"
                        disabled={monthlyAttendanceData.length === 0}
                    >
                        Export
                    </button>
                </div>
            </div>

            {loading && <p>Loading monthly attendance data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && monthlyAttendanceData.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Days</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Days</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {monthlyAttendanceData.map((record) => (
                                <tr key={record.employee_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.employee_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.present_days}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.absent_days}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.leave_days}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && monthlyAttendanceData.length === 0 && (
                <p>No monthly attendance records found for the selected month and employees.</p>
            )}
        </div>
    );
}