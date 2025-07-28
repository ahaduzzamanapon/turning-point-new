<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchController extends Controller
{
    public function index()
    {
        $batches = Batch::with('course')->get();
        return Inertia::render('Batch/Index', [
            'batches' => $batches,
        ]);
    }

    public function create()
    {
        $courses = Course::all();
        return Inertia::render('Batch/Create', [
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'status' => 'required|string|in:active,inactive',
        ]);

        Batch::create($request->all());

        return redirect()->route('batches.index')->with('success', 'Batch created successfully!');
    }

    public function show(Batch $batch)
    {
        $batch->load('course');
        return Inertia::render('Batch/Show', [
            'batch' => $batch,
        ]);
    }

    public function edit(Batch $batch)
    {
        $courses = Course::all();
        return Inertia::render('Batch/Edit', [
            'batch' => $batch,
            'courses' => $courses,
        ]);
    }

    public function update(Request $request, Batch $batch)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'status' => 'required|string|in:active,inactive',
        ]);

        $batch->update($request->all());

        return redirect()->route('batches.index')->with('success', 'Batch updated successfully!');
    }

    public function destroy(Batch $batch)
    {
        $batch->delete();

        return redirect()->route('batches.index')->with('success', 'Batch deleted successfully!');
    }
}
