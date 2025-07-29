<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Illuminate\Support\Collection;
use App\Models\Expense;
use App\Models\Income;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProfitLossExport implements FromCollection, WithHeadings, WithStyles
{
    protected $filters;
    protected $incomes;
    protected $expenses;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $startDate = $this->filters['start_date'] ?? null;
        $endDate = $this->filters['end_date'] ?? null;

        $incomesQuery = Income::query()->with('ledger');
        $expensesQuery = Expense::query()->with('ledger');

        if ($startDate) {
            $incomesQuery->where('date', '>=', $startDate);
            $expensesQuery->where('date', '>=', $startDate);
        }
        if ($endDate) {
            $incomesQuery->where('date', '<=', $endDate);
            $expensesQuery->where('date', '<=', $endDate);
        }

        $incomes = $incomesQuery->get();
        $expenses = $expensesQuery->get();

        $this->incomes = $incomes;
        $this->expenses = $expenses;

        $data = new Collection();

        // Incomes Section
        $data->push(['', 'INCOMES', '', '']);
        $data->push(['Date', 'Ledger', 'Amount', 'Description']);
        foreach ($incomes as $income) {
            $data->push([
                $income->date,
                $income->ledger->name,
                $income->amount,
                $income->description,
            ]);
        }
        $totalIncomes = $incomes->sum('amount');
        $data->push(['', 'Total Incomes', $totalIncomes, '']);
        $data->push(['', '', '', '']); // Blank row

        // Expenses Section
        $data->push(['', 'EXPENSES', '', '']);
        $data->push(['Date', 'Ledger', 'Amount', 'Description']);
        foreach ($expenses as $expense) {
            $data->push([
                $expense->date,
                $expense->ledger->name,
                $expense->amount,
                $expense->description,
            ]);
        }
        $totalExpenses = $expenses->sum('amount');
        $data->push(['', 'Total Expenses', $totalExpenses, '']);
        $data->push(['', '', '', '']); // Blank row

        // Profit/Loss Summary
        $profitLoss = $totalIncomes - $totalExpenses;
        $data->push(['', 'PROFIT / LOSS', $profitLoss, '']);

        return $data;
    }

    public function headings(): array
    {
        return [
            '',
            '',
            '',
            '',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('B1:D1');
        $sheet->mergeCells('B' . ($this->incomes->count() + 3) . ':D' . ($this->incomes->count() + 3));
        $sheet->mergeCells('B' . ($this->incomes->count() + $this->expenses->count() + 6) . ':D' . ($this->incomes->count() + $this->expenses->count() + 6));

        return [
            // Style the first row (Incomes header)
            1    => ['font' => ['bold' => true, 'size' => 14]],
            // Style the Incomes table header
            2    => ['font' => ['bold' => true]],
            // Style Total Incomes row
            ($this->incomes->count() + 3) => ['font' => ['bold' => true]],
            // Style Expenses header
            ($this->incomes->count() + 5) => ['font' => ['bold' => true, 'size' => 14]],
            // Style Expenses table header
            ($this->incomes->count() + 6) => ['font' => ['bold' => true]],
            // Style Total Expenses row
            ($this->incomes->count() + $this->expenses->count() + 7) => ['font' => ['bold' => true]],
            // Style Profit/Loss row
            ($this->incomes->count() + $this->expenses->count() + 9) => ['font' => ['bold' => true, 'size' => 16]],
        ];
    }
}
