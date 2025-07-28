<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RepresentativeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Representative::create(['name' => 'Sanjana', 'number' => '01896224207']);
        \App\Models\Representative::create(['name' => 'Zannat', 'number' => '01896224202']);
        \App\Models\Representative::create(['name' => 'Liza', 'number' => '01896224206']);
        \App\Models\Representative::create(['name' => 'Nasrin', 'number' => '01896224208']);
        \App\Models\Representative::create(['name' => 'Tanusree', 'number' => '01896400336']);
        \App\Models\Representative::create(['name' => 'Antora', 'number' => '01896400333']);
        \App\Models\Representative::create(['name' => 'Tania', 'number' => '01896224205']);
        \App\Models\Representative::create(['name' => 'Bappi Das Sir', 'number' => '01896224210']);
        \App\Models\Representative::create(['name' => 'Tarek Sir', 'number' => '01896224211']);
        \App\Models\Representative::create(['name' => 'Other', 'number' => 'other']);
    }
}