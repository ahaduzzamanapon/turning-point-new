<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::all();
        return Inertia::render('HRM/Employees/Index', ['employees' => $employees]);
    }

    public function create()
    {
        return Inertia::render('HRM/Employees/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'position' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
        ]);

        Employee::create($request->all());

        return redirect()->route('admin.employees.index')->with('success', 'Employee created successfully.');
    }

    public function edit(Employee $employee)
    {
        return Inertia::render('HRM/Employees/Edit', ['employee' => $employee]);
    }

    public function update(Request $request, Employee $employee)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'position' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
        ]);

        $employee->update($request->all());

        return redirect()->route('admin.employees.index')->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return redirect()->route('admin.employees.index')->with('success', 'Employee deleted successfully.');
    }

    public function getAllEmployees()
    {
        return Employee::all();
    }
}
