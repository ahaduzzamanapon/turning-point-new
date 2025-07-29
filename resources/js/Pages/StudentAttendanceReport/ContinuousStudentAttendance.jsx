import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

export default function ContinuousStudentAttendance({ selectedStudents }) {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [continuousAttendanceData, setContinuousAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContinuousAttendance();
    }, [fromDate, toDate, selectedStudents]);

    const fetchContinuousAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            const formattedFromDate = fromDate.toISOString().split('T')[0];
            const formattedToDate = toDate.toISOString().split('T')[0];
            const response = await axios.get('/api/reports/student-attendance/continuous', {
                params: {
                    from_date: formattedFromDate,
                    to_date: formattedToDate,
                    students: selectedStudents.join(','),
                },
            });
            setContinuousAttendanceData(response.data);
        } catch (err) {
            setError('Failed to fetch continuous student attendance.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const formattedFromDate = fromDate.toISOString().split('T')[0];
            const formattedToDate = toDate.toISOString().split('T')[0];
            const params = new URLSearchParams({
                from_date: formattedFromDate,
                to_date: formattedToDate,
                students: selectedStudents.join(','),
            }).toString();
            window.open(`/api/reports/student-attendance/continuous/export?${params}`, '_blank');
        } catch (err) {
            console.error('Failed to export continuous student attendance:', err);
            alert('Failed to export continuous student attendance.');
        }
    };

    // Helper to get all dates between two dates
    const getDatesBetween = (start, end) => {
        const dates = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const allDates = getDatesBetween(fromDate, toDate);

    return (
        <div className="continuous-attendance-tab">
            <h3 className="text-lg font-semibold mb-4">Continuous Student Attendance</h3>

            <div className="flex items-center space-x-4 mb-4">
                <div>
                    <label htmlFor="from-date-picker" className="block text-sm font-medium text-gray-700">From Date:</label>
                    <DatePicker
                        id="from-date-picker"
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="to-date-picker" className="block text-sm font-medium text-gray-700">To Date:</label>
                    <DatePicker
                        id="to-date-picker"
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="ml-auto">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600"
                        disabled={continuousAttendanceData.length === 0}
                    >
                        Export
                    </button>
                </div>
            </div>

            {loading && <p>Loading attendance data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && continuousAttendanceData.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                {allDates.map(date => (
                                    <th key={date.toISOString()} scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {date.getDate()}<br/>{date.toLocaleString('default', { month: 'short' })}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {continuousAttendanceData.map((studentRecord) => (
                                <tr key={studentRecord.student_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{studentRecord.student_name}</td>
                                    {allDates.map(date => {
                                        const formattedDate = date.toISOString().split('T')[0];
                                        const dailyRecord = studentRecord.attendance_records.find(rec => rec.date === formattedDate);
                                        let statusClass = '';
                                        let statusText = '-';

                                        if (dailyRecord) {
                                            statusText = dailyRecord.status.charAt(0).toUpperCase(); // P, A, L
                                            if (dailyRecord.status === 'present') {
                                                statusClass = 'bg-green-100 text-green-800';
                                            } else if (dailyRecord.status === 'absent') {
                                                statusClass = 'bg-red-100 text-red-800';
                                            } else if (dailyRecord.status === 'leave') {
                                                statusClass = 'bg-yellow-100 text-yellow-800';
                                            }
                                        }

                                        return (
                                            <td key={formattedDate} className="px-2 py-4 whitespace-nowrap text-sm text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                                                    {statusText}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && continuousAttendanceData.length === 0 && (
                <p>No continuous attendance records found for the selected date range and students.</p>
            )}
        </div>
    );
}