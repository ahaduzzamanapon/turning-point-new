<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ContinuousStudentAdmissionReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected $students;

    public function __construct($students)
    {
        $this->students = $students;
    }

    public function collection()
    {
        return $this->students;
    }

    public function headings(): array
    {
        return [
            'Student Name',
            'Mobile Number',
            'Admission Date',
            'Program Name',
            'Admission Status',
        ];
    }

    public function map($student): array
    {
        return [
            $student->name,
            $student->mobile_number,
            $student->admission_date,
            $student->course->name ?? 'N/A',
            $student->admission_status,
        ];
    }
}
