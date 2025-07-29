<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Ledger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with('ledger')->get();
        return Inertia::render('Accounts/Expenses/Index', ['expenses' => $expenses]);
    }

    public function create()
    {
        $ledgers = Ledger::where('type', 'expense')->get();
        return Inertia::render('Accounts/Expenses/Create', ['ledgers' => $ledgers]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ledger_id' => 'required|exists:ledgers,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        Expense::create($request->all());

        return redirect()->route('admin.expenses.index')->with('success', 'Expense created successfully.');
    }

    public function edit(Expense $expense)
    {
        $ledgers = Ledger::where('type', 'expense')->get();
        return Inertia::render('Accounts/Expenses/Edit', ['expense' => $expense->load('ledger'), 'ledgers' => $ledgers]);
    }

    public function update(Request $request, Expense $expense)
    {
        $request->validate([
            'ledger_id' => 'required|exists:ledgers,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $expense->update($request->all());

        return redirect()->route('admin.expenses.index')->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return redirect()->route('admin.expenses.index')->with('success', 'Expense deleted successfully.');
    }
}
