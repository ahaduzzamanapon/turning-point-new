<?php

namespace App\Exports;

use App\Models\Expense;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use App\Models\Ledger;

class LedgerExpensesExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $expenses = Expense::query()
            ->with('ledger')
            ->when($this->filters['start_date'] ?? null, function ($query) {
                $query->where('date', '>=', $this->filters['start_date']);
            })
            ->when($this->filters['end_date'] ?? null, function ($query) {
                $query->where('date', '<=', $this->filters['end_date']);
            })
            ->when($this->filters['ledger_id'] ?? null, function ($query) {
                $query->where('ledger_id', $this->filters['ledger_id']);
            })
            ->get();

        return $expenses;
    }

    public function headings(): array
    {
        return [
            'Date',
            'Ledger',
            'Amount',
            'Description',
        ];
    }

    public function map($expense): array
    {
        return [
            $expense->date,
            $expense->ledger->name,
            $expense->amount,
            $expense->description,
        ];
    }
}
