<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\PaymentMethod::create(['name' => 'Bkash (Merchant) (Payment)', 'number' => '01896 22 42 00']);
        \App\Models\PaymentMethod::create(['name' => 'Nagad (Merchant) (Payment)', 'number' => '01896 22 42 01']);
        \App\Models\PaymentMethod::create(['name' => 'Rocket (Send Money)', 'number' => '018304502805']);
        \App\Models\PaymentMethod::create(['name' => 'Cash in Hand (Office)', 'number' => '']);
    }
}