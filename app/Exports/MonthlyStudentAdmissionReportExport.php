<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class MonthlyStudentAdmissionReportExport implements FromArray, WithHeadings
{
    protected $reportData;

    public function __construct($reportData)
    {
        $this->reportData = $reportData;
    }

    public function array(): array
    {
        return [
            ['Metric', 'Count'],
            ['Total Admissions', $this->reportData->total_admissions],
            ['Confirmed Admissions', $this->reportData->confirmed_admissions],
            ['Pending Admissions', $this->reportData->pending_admissions],
            ['Cancelled Admissions', $this->reportData->cancelled_admissions],
        ];
    }

    public function headings(): array
    {
        return [
            'Metric',
            'Count',
        ];
    }
}
