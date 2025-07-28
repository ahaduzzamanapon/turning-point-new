import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

// Accept props from Inertia
export default function Dashboard({ totalStudents, totalCourses, monthlyRevenue, newRegistrations, salesData, enrollmentData }) {
    // Dynamic data for cards
    const cardData = [
        { title: 'Total Students', value: totalStudents, icon: '👥' },
        { title: 'Active Courses', value: totalCourses, icon: '📚' },
        { title: 'Revenue (Monthly)', value: `$${monthlyRevenue.toLocaleString()}`, icon: '💰' },
        { title: 'New Registrations', value: newRegistrations, icon: '📝' },
    ];

    // Data for Line Chart (using dynamic salesData)
    const lineChartConfig = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Monthly Sales',
                data: salesData, // Use dynamic data
                fill: false,
                borderColor: 'rgb(128, 0, 0)', // Maroon
                tension: 0.1,
            },
        ],
    };

    // Options for Line Chart
    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white', // Legend text color
                },
            },
            title: {
                display: true,
                text: 'Sales Performance',
                color: 'white', // Title text color
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white', // X-axis label color
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', // X-axis grid line color
                },
            },
            y: {
                ticks: {
                    color: 'white', // Y-axis label color
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', // Y-axis grid line color
                },
            },
        },
    };

    // Data for Bar Chart (using dynamic enrollmentData)
    const barChartConfig = {
        labels: ['Course A', 'Course B', 'Course C', 'Course D'],
        datasets: [
            {
                label: 'Enrollments',
                data: enrollmentData, // Use dynamic data
                backgroundColor: 'rgba(128, 0, 0, 0.7)', // Maroon with transparency
                borderColor: 'rgb(128, 0, 0)',
                borderWidth: 1,
            },
        ],
    };

    // Options for Bar Chart
    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                },
            },
            title: {
                display: true,
                text: 'Course Enrollments',
                color: 'white',
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            y: {
                ticks: {
                    color: 'white',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
        },
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Data Cards Section */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {cardData.map((card, index) => (
                            <div
                                key={index}
                                className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6 text-white flex items-center space-x-4"
                            >
                                <div className="text-4xl">{card.icon}</div>
                                <div>
                                    <p className="text-sm text-gray-300">{card.title}</p>
                                    <p className="text-2xl font-bold">{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Line Chart Card */}
                        <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                            <Line data={lineChartConfig} options={lineChartOptions} />
                        </div>

                        {/* Bar Chart Card */}
                        <div className="bg-black/30 backdrop-blur-xl shadow-lg rounded-lg border border-white/10 p-6">
                            <Bar data={barChartConfig} options={barChartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}