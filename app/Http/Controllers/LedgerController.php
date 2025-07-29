<?php

namespace App\Http\Controllers;

use App\Models\Ledger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LedgerController extends Controller
{
    public function index()
    {
        $ledgers = Ledger::all();
        return Inertia::render('Accounts/Ledgers/Index', ['ledgers' => $ledgers]);
    }

    public function create()
    {
        return Inertia::render('Accounts/Ledgers/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:ledgers',
            'type' => 'required|in:expense,income',
        ]);

        Ledger::create($request->all());

        return redirect()->route('admin.ledgers.index')->with('success', 'Ledger created successfully.');
    }

    public function edit(Ledger $ledger)
    {
        return Inertia::render('Accounts/Ledgers/Edit', ['ledger' => $ledger]);
    }

    public function update(Request $request, Ledger $ledger)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:ledgers,name,' . $ledger->id,
            'type' => 'required|in:expense,income',
        ]);

        $ledger->update($request->all());

        return redirect()->route('admin.ledgers.index')->with('success', 'Ledger updated successfully.');
    }

    public function destroy(Ledger $ledger)
    {
        $ledger->delete();
        return redirect()->route('admin.ledgers.index')->with('success', 'Ledger deleted successfully.');
    }
}
