<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class CourseController extends Controller
{
    public function __construct()
    {
       
    }

    public function index()
    {
        $data = Course::all();
        return Inertia::render('Course/Index', ['data' => $data]);
    }

    public function create()
    {
        return Inertia::render('Course/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|string|in:active,inactive',
            'description' => 'nullable|string',
        ]);

        Course::create($request->all());

        return redirect()->route('courses.index');
    }

    public function show(Course $course)
    {
        return Inertia::render('Course/Show', [
            'course' => $course,
        ]);
    }

    public function edit($id)
    {
        $courses = Course::find($id);
        return Inertia::render('Course/Edit', ['model' => $courses]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|string|in:active,inactive',
            'description' => 'nullable|string',
        ]);

          $courses = Course::find($id);

        $courses->update($request->all());

        return redirect()->route('courses.index');
    }

    public function destroy($id)
    {
        $courses = Course::find($id);
        $courses->delete();
        return redirect()->route('courses.index');
    }
}
