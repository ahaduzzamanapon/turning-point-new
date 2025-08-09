import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export default function StudentSelector({ onSelectStudents }) {
    const [students, setStudents] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch students from API
        // This is a placeholder. Replace with actual API call.
        const fetchStudents = async () => {
            try {
                const response = await axios.get('/api/students'); // Assuming an API endpoint /api/students
                setStudents(response.data.map(stu => ({ value: stu.id, label: stu.candidate_full_name })));
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        onSelectStudents(selectedOptions.map(option => option.value));
    }, [selectedOptions]);

    const handleSelectChange = (selected) => {
        setSelectedOptions(selected);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredStudents = students.filter(student =>
        student.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="student-selector">
            <h3 className="text-lg font-semibold mb-4">Select Students</h3>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search student by name or ID..."
                    className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="mb-4">
                <Select
                    isMulti
                    name="students"
                    options={filteredStudents}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleSelectChange}
                    value={selectedOptions}
                    placeholder="Select students..."
                />
            </div>
            <div className="selected-students-tags">
                {selectedOptions.length > 0 && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-800">Selected:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {selectedOptions.map(option => (
                                <span key={option.value} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {option.label}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedOptions(selectedOptions.filter(item => item.value !== option.value))}
                                        className="flex-shrink-0 ml-1.5 h-3 w-3 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-200 focus:text-blue-500"
                                    >
                                        <span className="sr-only">Remove tag</span>
                                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}