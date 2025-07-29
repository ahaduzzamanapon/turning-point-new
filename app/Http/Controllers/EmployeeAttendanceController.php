<?php

namespace App\Http\Controllers;

use App\Models\EmployeeAttendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = EmployeeAttendance::query()->with('employee');

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
                        'employee_name' => $record->employee->name,
                        'status' => $record->status,
                        'notes' => $record->notes,
                    ];
                })
            ];
        }

        return Inertia::render('HRM/EmployeeAttendances/Index', [
            'attendancesSummary' => $summary,
            'filters' => $request->all(),
        ]);
    }

    public function createBulk(Request $request)
    {
        $date = $request->input('date', now()->toDateString());
        $employees = Employee::all();

        // Check if attendance already exists for this date
        $existingAttendance = EmployeeAttendance::whereDate('date', $date)->get()->keyBy('employee_id');

        $employeesWithAttendance = $employees->map(function($employee) use ($existingAttendance) {
            $attendance = $existingAttendance->get($employee->id);
            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'status' => $attendance ? $attendance->status : 'absent', // Default to absent if not recorded
                'notes' => $attendance ? $attendance->notes : '',
                'check_in' => $attendance ? $attendance->check_in : '',
                'check_out' => $attendance ? $attendance->check_out : '',
            ];
        });

        return Inertia::render('HRM/EmployeeAttendances/CreateBulk', [
            'employees' => $employeesWithAttendance,
            'date' => $date,
        ]);
    }

    public function storeBulk(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'employees' => 'required|array',
            'employees.*.id' => 'required|exists:employees,id',
            'employees.*.status' => 'required|in:present,absent,leave',
            'employees.*.notes' => 'nullable|string',
            'employees.*.check_in' => 'nullable|date_format:H:i',
            'employees.*.check_out' => 'nullable|date_format:H:i|after:employees.*.check_in',
        ]);

        foreach ($request->employees as $employeeData) {
            EmployeeAttendance::updateOrCreate(
                ['employee_id' => $employeeData['id'], 'date' => $request->date],
                ['status' => $employeeData['status'], 'notes' => $employeeData['notes'], 'check_in' => $employeeData['check_in'], 'check_out' => $employeeData['check_out']]
            );
        }

        return redirect()->route('admin.employee_attendances.index')->with('success', 'Bulk employee attendance recorded successfully.');
    }

    public function edit(EmployeeAttendance $employee_attendance)
    {
        $employees = Employee::all();
        return Inertia::render('HRM/EmployeeAttendances/Edit', ['attendance' => $employee_attendance->load('employee'), 'employees' => $employees]);
    }

    public function update(Request $request, EmployeeAttendance $employee_attendance)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,leave',
            'notes' => 'nullable|string',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i|after:check_in',
        ]);

        $employee_attendance->update($request->all());

        return redirect()->route('admin.employee_attendances.index')->with('success', 'Employee attendance updated successfully.');
    }

    public function destroy(EmployeeAttendance $employee_attendance)
    {
        $employee_attendance->delete();
        return redirect()->route('admin.employee_attendances.index')->with('success', 'Employee attendance deleted successfully.');
    }
}
