<?php

namespace App\Http\Controllers;

use App\Models\Representative;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class RepresentativeController extends Controller
{
    public function __construct()
    {
       
    }

    public function index()
    {
        $data = Representative::all();
        return Inertia::render('Representative/Index', ['data' => $data]);
    }

    public function create()
    {
        return Inertia::render('Representative/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            // validation rules
        ]);

        Representative::create($request->all());

        return redirect()->route('representatives.index');
    }

    public function edit($id)
    {
        $representatives = Representative::find($id);
        return Inertia::render('Representative/Edit', ['model' => $representatives]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            // validation rules
        ]);

          $representatives = Representative::find($id);

        $representatives->update($request->all());

        return redirect()->route('representatives.index');
    }

    public function destroy($id)
    {
        $representatives = Representative::find($id);
        $representatives->delete();
        return redirect()->route('representatives.index');
    }
}
