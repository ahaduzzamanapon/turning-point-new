<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\EmployeeAttendance;
use App\Models\Employee;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DailyAttendanceExport;
use App\Exports\MonthlyAttendanceExport;
use App\Exports\ContinuousAttendanceExport;
use Carbon\Carbon;

class AttendanceReportController extends Controller
{
    public function index()
    {
        return Inertia::render('AttendanceReport/Index');
    }

    public function getDailyAttendance(Request $request)
    {
        $date = $request->input('date');
        $filter = $request->input('filter');
        $employeeIds = $request->input('employees');

        $query = EmployeeAttendance::query()
            ->whereDate('date', $date)
            ->with('employee');

        if ($filter && $filter !== 'all') {
            $query->where('status', $filter);
        }

        if ($employeeIds) {
            $employeeIdsArray = explode(',', $employeeIds);
            $query->whereIn('employee_id', $employeeIdsArray);
        }

        $attendance = $query->get()->map(function ($record) {
            return [
                'id' => $record->id,
                'employee_name' => $record->employee->name,
                'status' => $record->status,
                'check_in' => $record->check_in,
                'check_out' => $record->check_out,
                'notes' => $record->notes,
            ];
        });

        return response()->json($attendance);
    }

    public function exportDailyAttendance(Request $request)
    {
        $date = $request->input('date');
        $filter = $request->input('filter');
        $employeeIds = $request->input('employees');

        $fileName = 'daily_attendance_' . $date . '.xlsx';

        return Excel::download(new DailyAttendanceExport($date, $filter, $employeeIds), $fileName);
    }

    public function getMonthlyAttendance(Request $request)
    {
        $month = $request->input('month'); // YYYY-MM
        $employeeIds = $request->input('employees');

        $startDate = \Carbon\Carbon::parse($month)->startOfMonth();
        $endDate = \Carbon\Carbon::parse($month)->endOfMonth();

        $query = EmployeeAttendance::query()
            ->whereBetween('date', [$startDate, $endDate]);

        if ($employeeIds) {
            $employeeIdsArray = explode(',', $employeeIds);
            $query->whereIn('employee_id', $employeeIdsArray);
        }

        $attendance = $query->get();

        $monthlySummary = $attendance->groupBy('employee_id')->map(function ($records, $employeeId) {
            $employee = Employee::find($employeeId);
            return [
                'employee_id' => $employeeId,
                'employee_name' => $employee ? $employee->name : 'Unknown Employee',
                'present_days' => $records->where('status', 'present')->count(),
                'absent_days' => $records->where('status', 'absent')->count(),
                'leave_days' => $records->where('status', 'leave')->count(),
            ];
        })->values();

        return response()->json($monthlySummary);
    }

    public function exportMonthlyAttendance(Request $request)
    {
        $month = $request->input('month');
        $employeeIds = $request->input('employees');

        $fileName = 'monthly_attendance_' . $month . '.xlsx';

        return Excel::download(new MonthlyAttendanceExport($month, $employeeIds), $fileName);
    }

    public function getContinuousAttendance(Request $request)
    {
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');
        $employeeIds = $request->input('employees');

        $query = EmployeeAttendance::query()
            ->whereBetween('date', [$fromDate, $toDate])
            ->with('employee');

        if ($employeeIds) {
            $employeeIdsArray = explode(',', $employeeIds);
            $query->whereIn('employee_id', $employeeIdsArray);
        }

        $attendanceRecords = $query->get()->groupBy('employee_id');

        $continuousReport = [];
        foreach ($attendanceRecords as $employeeId => $records) {
            $employee = Employee::find($employeeId);
            if ($employee) {
                $employeeData = [
                    'employee_id' => $employeeId,
                    'employee_name' => $employee->name,
                    'attendance_records' => [],
                ];

                $currentDate = Carbon::parse($fromDate);
                $endDate = Carbon::parse($toDate);

                while ($currentDate->lte($endDate)) {
                    $recordForDate = $records->where('date', $currentDate->toDateString())->first();
                    $employeeData['attendance_records'][] = [
                        'date' => $currentDate->toDateString(),
                        'status' => $recordForDate ? $recordForDate->status : 'absent', // Default to absent if no record
                    ];
                    $currentDate->addDay();
                }
                $continuousReport[] = $employeeData;
            }
        }

        return response()->json($continuousReport);
    }

    public function exportContinuousAttendance(Request $request)
    {
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');
        $employeeIds = $request->input('employees');

        $fileName = 'continuous_attendance_' . $fromDate . '_' . $toDate . '.xlsx';

        return Excel::download(new ContinuousAttendanceExport($fromDate, $toDate, $employeeIds), $fileName);
    }
}
