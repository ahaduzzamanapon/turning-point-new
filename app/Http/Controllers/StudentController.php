<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Requests\StudentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Course;
use App\Models\Batch;
use App\Models\PaymentMethod;
use App\Models\Representative;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with(['course', 'batch', 'paymentMethod', 'representative'])->get();
        return Inertia::render('Student/Index', [
            'students' => $students,
            'courses' => \App\Models\Course::all(),
            'batches' => \App\Models\Batch::all(),
            'paymentMethods' => \App\Models\PaymentMethod::all(),
            'representatives' => \App\Models\Representative::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Student/Create');
    }

    public function store(StudentRequest $request)
    {
    
        $validatedData = $request->validated();
        $lastStudent = Student::latest()->first();
        $lastId = $lastStudent ? (int) substr($lastStudent->student_id, 5) : 0;
        $newId = 'TPJA-' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT);
        $validatedData['student_id'] = $newId;
        Student::create($validatedData);
        //dd($request->all());

        return redirect('/')->with('success', 'Student registered successfully!');
    }

    public function show(Student $student)
    {
        return Inertia::render('Student/Show', [
            'student' => $student,
        ]);
    }

    public function edit(Student $student)
    {
        $courses = Course::all();
        $batches = Batch::all();
        $paymentMethods = PaymentMethod::all();
        $representatives = Representative::all();

        return Inertia::render('Student/Edit', [
            'student' => $student->load('course', 'batch', 'paymentMethod', 'representative'),
            'courses' => $courses,
            'batches' => $batches,
            'paymentMethods' => $paymentMethods,
            'representatives' => $representatives,
        ]);
    }

    public function update(StudentRequest $request, Student $student)
    {
        $student->update($request->validated());

        return redirect()->route('admin.students.index')->with('success', 'Student updated successfully!');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('admin.students.index')->with('success', 'Student deleted successfully!');
    }

    public function toggleActiveStatus(Student $student)
    {
        $student->is_active = !$student->is_active;
        $student->save();

        return redirect()->route('admin.students.index')->with('success', 'Student status updated successfully!');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:students,id',
            'is_active' => 'required|boolean',
        ]);

        Student::whereIn('id', $request->ids)->update(['is_active' => $request->is_active]);

        return redirect()->route('admin.students.index')->with('success', 'Selected students status updated successfully!');
    }

    public function verifyPayment($studentId)
    {
        
        //dd($studentId);
        $student = Student::findOrFail($studentId);
        $student->payment_status = 'verified';
        $student->save();
        return redirect()->route('admin.students.index')->with('success', 'Payment verified successfully!');
    }

    public function rejectPayment($studentId)
    {
        $student = Student::findOrFail($studentId);
        $student->payment_status = 'rejected';
        $student->save();

        return redirect()->route('admin.students.index')->with('success', 'Payment rejected successfully!');
    }

    public function updateDuePayment(Request $request, Student $student)
    {
        Log::info('Raw Request Content:', ['content' => file_get_contents('php://input')]);
        Log::info('updateDuePayment: Request data:', $request->all());
        $request->validate([
            'amount_paid' => 'required|numeric|min:0',
        ]);

        Log::info('updateDuePayment: Student ID', ['id' => $student->id]);
        Log::info('updateDuePayment: Amount paid from request', ['amount_paid' => $request->amount_paid]);
        Log::info('updateDuePayment: Current amount_sent before update', ['amount_sent' => $student->amount_sent]);

        $student->amount_sent += $request->amount_paid;
        $student->save();

        Log::info('updateDuePayment: New amount_sent after update', ['amount_sent' => $student->amount_sent]);

        // Reload the student with the course relationship to get the latest course amount
        $student->load('course');

        Log::info('updateDuePayment: Course amount', ['course_amount' => $student->course->amount]);

        if ($student->amount_sent >= $student->course->amount) {
            $student->payment_status = 'verified';
            $student->save();
            Log::info('updateDuePayment: Payment status set to verified', ['payment_status' => $student->payment_status]);
        } else {
            Log::info('updateDuePayment: Payment status remains unchanged', ['payment_status' => $student->payment_status]);
        }

        return redirect()->route('admin.students.index')->with('success', 'Due payment updated successfully!');
    }

    public function markRegistrationComplete(Student $student)
    {
        $student->registration_status = 'completed';
        $student->save();

        // Send email confirmation
        Mail::to($student->email)->send(new RegistrationConfirmationMail($student));

        return redirect()->route('admin.students.index')->with('success', 'Student registration marked as complete!');
    }

    public function bulkMarkRegistrationComplete(Request $request)
    {
        Log::info('bulkMarkRegistrationComplete request data:', $request->all());
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:students,id',
        ]);

        $students = Student::whereIn('id', $request->ids)->get();

        foreach ($students as $student) {
            $student->registration_status = 'completed';
            $student->save();
            Mail::to($student->email)->send(new RegistrationConfirmationMail($student));
        }

        return redirect()->route('admin.students.index')->with('success', 'Selected students registration marked as complete!');
    }
}