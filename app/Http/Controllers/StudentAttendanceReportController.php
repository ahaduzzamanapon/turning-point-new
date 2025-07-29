<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\StudentAttendance;
use App\Models\Student;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DailyStudentAttendanceExport;
use App\Exports\MonthlyStudentAttendanceExport;
use App\Exports\ContinuousStudentAttendanceExport;
use Carbon\Carbon;

class StudentAttendanceReportController extends Controller
{
    public function index()
    {
        return Inertia::render('StudentAttendanceReport/Index');
    }

    public function getDailyAttendance(Request $request)
    {
        $date = $request->input('date');
        $filter = $request->input('filter');
        $studentIds = $request->input('students');

        $query = StudentAttendance::query()
            ->whereDate('date', $date)
            ->with('student');

        if ($filter && $filter !== 'all') {
            $query->where('status', $filter);
        }

        if ($studentIds) {
            $studentIdsArray = explode(',', $studentIds);
            $query->whereIn('student_id', $studentIdsArray);
        }

        $attendance = $query->get()->map(function ($record) {
            return [
                'id' => $record->id,
                'student_name' => $record->student->candidate_full_name,
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
        $studentIds = $request->input('students');

        $fileName = 'daily_student_attendance_' . $date . '.xlsx';

        return Excel::download(new DailyStudentAttendanceExport($date, $filter, $studentIds), $fileName);
    }

    public function getMonthlyAttendance(Request $request)
    {
        $month = $request->input('month'); // YYYY-MM
        $studentIds = $request->input('students');

        $startDate = Carbon::parse($month)->startOfMonth();
        $endDate = Carbon::parse($month)->endOfMonth();

        $query = StudentAttendance::query()
            ->whereBetween('date', [$startDate, $endDate]);

        if ($studentIds) {
            $studentIdsArray = explode(',', $studentIds);
            $query->whereIn('student_id', $studentIdsArray);
        }

        $attendance = $query->get();

        $monthlySummary = $attendance->groupBy('student_id')->map(function ($records, $studentId) {
            $student = Student::find($studentId);
            return [
                'student_id' => $studentId,
                'student_name' => $student ? $student->candidate_full_name : 'Unknown Student',
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
        $studentIds = $request->input('students');

        $fileName = 'monthly_student_attendance_' . $month . '.xlsx';

        return Excel::download(new MonthlyStudentAttendanceExport($month, $studentIds), $fileName);
    }

    public function getContinuousAttendance(Request $request)
    {
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');
        $studentIds = $request->input('students');

        $query = StudentAttendance::query()
            ->whereBetween('date', [$fromDate, $toDate])
            ->with('student');

        if ($studentIds) {
            $studentIdsArray = explode(',', $studentIds);
            $query->whereIn('student_id', $studentIdsArray);
        }

        $attendanceRecords = $query->get()->groupBy('student_id');

        $continuousReport = [];
        foreach ($attendanceRecords as $studentId => $records) {
            $student = Student::find($studentId);
            if ($student) {
                $studentData = [
                    'student_id' => $studentId,
                    'student_name' => $student->candidate_full_name,
                    'attendance_records' => [],
                ];

                $currentDate = Carbon::parse($fromDate);
                $endDate = Carbon::parse($toDate);

                while ($currentDate->lte($endDate)) {
                    $recordForDate = $records->where('date', $currentDate->toDateString())->first();
                    $studentData['attendance_records'][] = [
                        'date' => $currentDate->toDateString(),
                        'status' => $recordForDate ? $recordForDate->status : 'absent', // Default to absent if no record
                    ];
                    $currentDate->addDay();
                }
                $continuousReport[] = $studentData;
            }
        }

        return response()->json($continuousReport);
    }

    public function exportContinuousAttendance(Request $request)
    {
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');
        $studentIds = $request->input('students');

        $fileName = 'continuous_student_attendance_' . $fromDate . '_' . $toDate . '.xlsx';

        return Excel::download(new ContinuousStudentAttendanceExport($fromDate, $toDate, $studentIds), $fileName);
    }
}
