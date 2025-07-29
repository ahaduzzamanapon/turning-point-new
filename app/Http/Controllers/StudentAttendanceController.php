<?php

namespace App\Http\Controllers;

use App\Models\StudentAttendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentAttendance::query()->with('student');

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        $attendances = $query->get()->groupBy('date');

        $summary = [];
        foreach ($attendances as $date => $records) {
            $summary[$date] = [
                'total_present' => $records->where('status', 'present')->count(),
                'total_absent' => $records->where('status', 'absent')->count(),
                'total_leave' => $records->where('status', 'leave')->count(),
                'details' => $records->map(function($record) {
                    return [
                        'student_name' => $record->student->candidate_full_name,
                        'status' => $record->status,
                        'notes' => $record->notes,
                    ];
                })
            ];
        }

        return Inertia::render('HRM/StudentAttendances/Index', [
            'attendancesSummary' => $summary,
            'filters' => $request->all(),
        ]);
    }

    public function createBulk(Request $request)
    {
        $date = $request->input('date', now()->toDateString());
        $students = Student::all();

        // Check if attendance already exists for this date
        $existingAttendance = StudentAttendance::whereDate('date', $date)->get()->keyBy('student_id');

        $studentsWithAttendance = $students->map(function($student) use ($existingAttendance) {
            $attendance = $existingAttendance->get($student->id);
            return [
                'id' => $student->id,
                'name' => $student->candidate_full_name,
                'status' => $attendance ? $attendance->status : 'absent', // Default to absent if not recorded
                'notes' => $attendance ? $attendance->notes : '',
                'check_in' => $attendance ? $attendance->check_in : '',
                'check_out' => $attendance ? $attendance->check_out : '',
            ];
        });

        return Inertia::render('HRM/StudentAttendances/CreateBulk', [
            'students' => $studentsWithAttendance,
            'date' => $date,
        ]);
    }

    public function storeBulk(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'students' => 'required|array',
            'students.*.id' => 'required|exists:students,id',
            'students.*.status' => 'required|in:present,absent,leave',
            'students.*.notes' => 'nullable|string',
            'students.*.check_in' => 'nullable|date_format:H:i',
            'students.*.check_out' => 'nullable|date_format:H:i|after:students.*.check_in',
        ]);

        foreach ($request->students as $studentData) {
            StudentAttendance::updateOrCreate(
                ['student_id' => $studentData['id'], 'date' => $request->date],
                ['status' => $studentData['status'], 'notes' => $studentData['notes'], 'check_in' => $studentData['check_in'], 'check_out' => $studentData['check_out']]
            );
        }

        return redirect()->route('admin.student_attendances.index')->with('success', 'Bulk student attendance recorded successfully.');
    }

    public function edit(StudentAttendance $student_attendance)
    {
        $students = Student::all();
        return Inertia::render('HRM/StudentAttendances/Edit', ['attendance' => $student_attendance->load('student'), 'students' => $students]);
    }

    public function update(Request $request, StudentAttendance $student_attendance)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,leave',
            'notes' => 'nullable|string',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i|after:check_in',
        ]);

        $student_attendance->update($request->all());

        return redirect()->route('admin.student_attendances.index')->with('success', 'Student attendance updated successfully.');
    }

    public function destroy(StudentAttendance $student_attendance)
    {
        $student_attendance->delete();
        return redirect()->route('admin.student_attendances.index')->with('success', 'Student attendance deleted successfully.');
    }
}
