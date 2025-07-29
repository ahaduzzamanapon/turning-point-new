<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Models\Ledger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncomeController extends Controller
{
    public function index()
    {
        $incomes = Income::with('ledger')->get();
        return Inertia::render('Accounts/Incomes/Index', ['incomes' => $incomes]);
    }

    public function create()
    {
        $ledgers = Ledger::where('type', 'income')->get();
        return Inertia::render('Accounts/Incomes/Create', ['ledgers' => $ledgers]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ledger_id' => 'required|exists:ledgers,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        Income::create($request->all());

        return redirect()->route('admin.incomes.index')->with('success', 'Income created successfully.');
    }

    public function edit(Income $income)
    {
        $ledgers = Ledger::where('type', 'income')->get();
        return Inertia::render('Accounts/Incomes/Edit', ['income' => $income->load('ledger'), 'ledgers' => $ledgers]);
    }

    public function update(Request $request, Income $income)
    {
        $request->validate([
            'ledger_id' => 'required|exists:ledgers,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $income->update($request->all());

        return redirect()->route('admin.incomes.index')->with('success', 'Income updated successfully.');
    }

    public function destroy(Income $income)
    {
        $income->delete();
        return redirect()->route('admin.incomes.index')->with('success', 'Income deleted successfully.');
    }
}
