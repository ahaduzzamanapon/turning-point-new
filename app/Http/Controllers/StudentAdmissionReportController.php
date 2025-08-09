<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Course;
use App\Models\Batch;
use App\Models\PaymentMethod;
use App\Models\Representative;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DailyStudentAdmissionReportExport;
use App\Exports\MonthlyStudentAdmissionReportExport;
use App\Exports\ContinuousStudentAdmissionReportExport;

class StudentAdmissionReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports/StudentAdmissionReport');
    }

    public function getDailyReport(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'status' => 'nullable|string|in:all,confirmed,pending,cancelled',
            'student_ids' => 'nullable|array',
        ]);

        $date = $request->input('date');
        $fromDate = date('Y-m-d 00:00:00', strtotime($date ));
        $toDate = date('Y-m-d 23:59:59', strtotime($date ));
        $status = $request->input('status', 'all');
        $student_ids = $request->input('student_ids');

        $query = Student::query()
            ->whereBetween('created_at', [$fromDate, $toDate]);

        if ($status !== 'all') {
            $query->where('admission_status', $status);
        }

        if (!empty($student_ids)) {
            $query->whereIn('id', $student_ids);
        }

        $students = $query->with(['course', 'batch', 'paymentMethod', 'representative'])->get();

        return response()->json($students);
    }

    public function getMonthlyReport(Request $request)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
            'student_ids' => 'nullable|array',
        ]);

        $month = $request->input('month');
        $student_ids = $request->input('student_ids');

        $query = Student::query()
            ->whereYear('admission_date', substr($month, 0, 4))
            ->whereMonth('admission_date', substr($month, 5, 2));

        if (!empty($student_ids)) {
            $query->whereIn('id', $student_ids);
        }

        $report = $query->selectRaw(
            'count(*) as total_admissions,
            count(case when admission_status = "confirmed" then 1 else null end) as confirmed_admissions,
            count(case when admission_status = "pending" then 1 else null end) as pending_admissions,
            count(case when admission_status = "cancelled" then 1 else null end) as cancelled_admissions'
        )->first();

        return response()->json($report);
    }

    public function getContinuousReport(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'status' => 'nullable|string|in:all,confirmed,pending,cancelled',
            'student_ids' => 'nullable|array',
        ]);

        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');
        $status = $request->input('status', 'all');
        $student_ids = $request->input('student_ids');

        $query = Student::query()
            ->whereBetween('admission_date', [$fromDate, $toDate]);

        if ($status !== 'all') {
            $query->where('admission_status', $status);
        }

        if (!empty($student_ids)) {
            $query->whereIn('id', $student_ids);
        }

        $students = $query->with(['course', 'batch', 'paymentMethod', 'representative'])->get();

        return response()->json($students);
    }

    public function getAllStudents()
    {
        $students = Student::select('id', 'name', 'mobile_number')->get();
        return response()->json($students);
    }

    public function exportDailyReport(Request $request, $type)
    {
        $request->validate([
            'date' => 'required|date',
            'status' => 'nullable|string|in:all,confirmed,pending,cancelled',
            'student_ids' => 'nullable|array',
        ]);

        $date = $request->input('date');
        $status = $request->input('status', 'all');
        $student_ids = $request->input('student_ids');

        $query = Student::query()
            ->whereDate('admission_date', $date);

        if ($status !== 'all') {
            $query->where('admission_status', $status);
        }

        if (!empty($student_ids)) {
            $query->whereIn('id', $student_ids);
        }

        $students = $query->with(['course', 'batch', 'paymentMethod', 'representative'])->get();

        $fileName = 'daily_student_admission_report_' . $date . '.' . $type;

        if ($type === 'xlsx') {
            return Excel::download(new DailyStudentAdmissionReportExport($students), $fileName);
        } elseif ($type === 'pdf') {
            return Excel::download(new DailyStudentAdmissionReportExport($students), $fileName, \Maatwebsite\Excel\Excel::DOMPDF);
        }

        return response()->json(['message' => 'Invalid export type'], 400);
    }

    public function exportMonthlyReport(Request $request, $type)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
            'student_ids' => 'nullable|array',
        ]);

        $month = $request->input('month');
        $student_ids = $request->input('student_ids');

        $query = Student::query()
            ->whereYear('admission_date', substr($month, 0, 4))
            ->whereMonth('admission_date', substr($month, 5, 2));

        if (!empty($student_ids)) {
            $query->whereIn('id', $student_ids);
        }

        $report = $query->selectRaw(
            'count(*) as total_admissions,
            count(case when admission_status = "confirmed" then 1 else null end) as confirmed_admissions,
            count(case when admission_status = "pending" then 1 else null end) as pending_admissions,
            count(case when admission_status = "cancelled" then 1 else null end) as cancelled_admissions'
        )->first();

        $fileName = 'monthly_student_admission_report_' . $month . '.' . $type;

        if ($type === 'xlsx') {
            return Excel::download(new MonthlyStudentAdmissionReportExport($report), $fileName);
        } elseif ($type === 'pdf') {
            return Excel::download(new MonthlyStudentAdmissionReportExport($report), $fileName, \Maatwebsite\Excel\Excel::DOMPDF);
        }

        return response()->json(['message' => 'Invalid export type'], 400);
    }

    public function exportContinuousReport(Request $request, $type)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'status' => 'nullable|string|in:all,confirmed,pending,cancelled',
            'student_ids' => 'nullable|array',
        ]);

        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');
        $status = $request->input('status', 'all');
        $student_ids = $request->input('student_ids');

        $query = Student::query()
            ->whereBetween('admission_date', [$fromDate, $toDate]);

        if ($status !== 'all') {
            $query->where('admission_status', $status);
        }

        if (!empty($student_ids)) {
            $query->whereIn('id', $student_ids);
        }

        $students = $query->with(['course', 'batch', 'paymentMethod', 'representative'])->get();

        $fileName = 'continuous_student_admission_report_' . $fromDate . '_' . $toDate . '.' . $type;

        if ($type === 'xlsx') {
            return Excel::download(new ContinuousStudentAdmissionReportExport($students), $fileName);
        } elseif ($type === 'pdf') {
            return Excel::download(new ContinuousStudentAdmissionReportExport($students), $fileName, \Maatwebsite\Excel\Excel::DOMPDF);
        }

        return response()->json(['message' => 'Invalid export type'], 400);
    }
}
