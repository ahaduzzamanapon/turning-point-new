<?php

namespace App\Exports;

use App\Models\EmployeeAttendance;
use App\Models\Employee;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Carbon\Carbon;

class ContinuousAttendanceExport implements FromCollection, WithHeadings
{
    protected $fromDate;
    protected $toDate;
    protected $employeeIds;

    public function __construct(string $fromDate, string $toDate, ?string $employeeIds)
    {
        $this->fromDate = $fromDate;
        $this->toDate = $toDate;
        $this->employeeIds = $employeeIds;
    }

    public function collection()
    {
        $query = EmployeeAttendance::query()
            ->whereBetween('date', [$this->fromDate, $this->toDate])
            ->with('employee');

        if ($this->employeeIds) {
            $employeeIdsArray = explode(',', $this->employeeIds);
            $query->whereIn('employee_id', $employeeIdsArray);
        }

        $attendanceRecords = $query->get()->groupBy('employee_id');

        $exportData = collect();
        $allDates = $this->getDatesBetween($this->fromDate, $this->toDate);

        foreach ($attendanceRecords as $employeeId => $records) {
            $employee = Employee::find($employeeId);
            if ($employee) {
                $rowData = [
                    'Employee Name' => $employee->name,
                ];

                foreach ($allDates as $date) {
                    $formattedDate = $date->toDateString();
                    $recordForDate = $records->where('date', $formattedDate)->first();
                    $rowData[$formattedDate] = $recordForDate ? ucfirst($recordForDate->status) : 'Absent';
                }
                $exportData->push($rowData);
            }
        }

        return $exportData;
    }

    public function headings(): array
    {
        $headings = ['Employee Name'];
        $allDates = $this->getDatesBetween($this->fromDate, $this->toDate);
        foreach ($allDates as $date) {
            $headings[] = $date->format('Y-m-d');
        }
        return $headings;
    }

    private function getDatesBetween($startDate, $endDate)
    {
        $dates = [];
        $currentDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);

        while ($currentDate->lte($endDate)) {
            $dates[] = $currentDate->copy();
            $currentDate->addDay();
        }
        return $dates;
    }
}
