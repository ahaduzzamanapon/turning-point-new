<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Income;
use App\Models\Ledger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LedgerExpensesExport;
use App\Exports\LedgerIncomesExport;
use App\Exports\ProfitLossExport;

class ReportController extends Controller
{
    public function ledgerWiseExpenses(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'ledger_id' => 'nullable|exists:ledgers,id',
        ]);

        $expenses = Expense::query()
            ->with('ledger')
            ->when($request->start_date, function ($query) use ($request) {
                $query->where('date', '>=', $request->start_date);
            })
            ->when($request->end_date, function ($query) use ($request) {
                $query->where('date', '<=', $request->end_date);
            })
            ->when($request->ledger_id, function ($query) use ($request) {
                $query->where('ledger_id', $request->ledger_id);
            })
            ->get()
            ->groupBy('ledger.name');

        $ledgers = Ledger::where('type', 'expense')->get();

        return Inertia::render('Accounts/Reports/LedgerWiseExpenses', [
            'expenses' => $expenses,
            'filters' => $request->all(),
            'ledgers' => $ledgers,
        ]);
    }

    public function ledgerWiseIncomes(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'ledger_id' => 'nullable|exists:ledgers,id',
        ]);

        $incomes = Income::query()
            ->with('ledger')
            ->when($request->start_date, function ($query) use ($request) {
                $query->where('date', '>=', $request->start_date);
            })
            ->when($request->end_date, function ($query) use ($request) {
                $query->where('date', '<=', $request->end_date);
            })
            ->when($request->ledger_id, function ($query) use ($request) {
                $query->where('ledger_id', $request->ledger_id);
            })
            ->get()
            ->groupBy('ledger.name');

        $ledgers = Ledger::where('type', 'income')->get();

        return Inertia::render('Accounts/Reports/LedgerWiseIncomes', [
            'incomes' => $incomes,
            'filters' => $request->all(),
            'ledgers' => $ledgers,
        ]);
    }

    public function profitLoss(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $totalExpenses = Expense::query()
            ->when($request->start_date, function ($query) use ($request) {
                $query->where('date', '>=', $request->start_date);
            })
            ->when($request->end_date, function ($query) use ($request) {
                $query->where('date', '<=', $request->end_date);
            })
            ->sum('amount');

        $totalIncomes = Income::query()
            ->when($request->start_date, function ($query) use ($request) {
                $query->where('date', '>=', $request->start_date);
            })
            ->when($request->end_date, function ($query) use ($request) {
                $query->where('date', '<=', $request->end_date);
            })
            ->sum('amount');

        $profitLoss = $totalIncomes - $totalExpenses;

        return Inertia::render('Accounts/Reports/ProfitLoss', [
            'totalExpenses' => $totalExpenses,
            'totalIncomes' => $totalIncomes,
            'profitLoss' => $profitLoss,
            'filters' => $request->all(),
        ]);
    }

    public function exportLedgerWiseExpenses(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'ledger_id' => 'nullable|exists:ledgers,id',
        ]);

        return Excel::download(new LedgerExpensesExport($request->all()), 'ledger_wise_expenses.xlsx');
    }

    public function exportLedgerWiseIncomes(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'ledger_id' => 'nullable|exists:ledgers,id',
        ]);

        return Excel::download(new LedgerIncomesExport($request->all()), 'ledger_wise_incomes.xlsx');
    }

    public function exportProfitLoss(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        return Excel::download(new ProfitLossExport($request->all()), 'profit_loss_report.xlsx');
    }
}
