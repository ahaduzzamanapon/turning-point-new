import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

export default function DailyAttendance({ selectedEmployees }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filter, setFilter] = useState('all'); // 'all', 'present', 'absent', 'leave'
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDailyAttendance();
    }, [selectedDate, filter, selectedEmployees]);

    const fetchDailyAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await axios.get('/api/reports/attendance/daily', {
                params: {
                    date: formattedDate,
                    filter: filter,
                    employees: selectedEmployees.join(','),
                },
            });
            setAttendanceData(response.data);
        } catch (err) {
            setError('Failed to fetch daily attendance.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const handleExport = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const params = new URLSearchParams({
                date: formattedDate,
                filter: filter,
                employees: selectedEmployees.join(','),
            }).toString();
            window.open(`/api/reports/attendance/daily/export?${params}`, '_blank');
        } catch (err) {
            console.error('Failed to export daily attendance:', err);
            alert('Failed to export daily attendance.');
        }
    };

    return (
        <div className="daily-attendance-tab">
            <h3 className="text-lg font-semibold mb-4">Daily Attendance</h3>

            <div className="flex items-center space-x-4 mb-4">
                <div>
                    <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700">Select Date:</label>
                    <DatePicker
                        id="date-picker"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                        All Attendance
                    </button>
                    <button
                        onClick={() => handleFilterChange('present')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'present' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                        Present Only
                    </button>
                    <button
                        onClick={() => handleFilterChange('absent')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'absent' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                        Absent Only
                    </button>
                    <button
                        onClick={() => handleFilterChange('leave')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'leave' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                        On Leave
                    </button>
                </div>
                <div className="ml-auto">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600"
                        disabled={attendanceData.length === 0}
                    >
                        Export
                    </button>
                </div>
            </div>

            {loading && <p>Loading attendance data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && attendanceData.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attendanceData.map((record) => (
                                <tr key={record.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.employee_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'present' ? 'bg-green-100 text-green-800' : record.status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.check_in || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.check_out || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.notes || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && attendanceData.length === 0 && (
                <p>No attendance records found for the selected date and filters.</p>
            )}
        </div>
    );
}