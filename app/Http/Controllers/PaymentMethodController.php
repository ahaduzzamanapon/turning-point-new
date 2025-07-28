<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class PaymentMethodController extends Controller
{
    public function __construct()
    {
       
    }

    public function index()
    {
        $data = PaymentMethod::all();
        return Inertia::render('PaymentMethod/Index', ['data' => $data]);
    }

    public function create()
    {
        return Inertia::render('PaymentMethod/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            // validation rules
        ]);

        PaymentMethod::create($request->all());

        return redirect()->route('paymentmethods.index');
    }

    public function edit($id)
    {
        $paymentmethods = PaymentMethod::find($id);
        return Inertia::render('PaymentMethod/Edit', ['model' => $paymentmethods]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            // validation rules
        ]);

          $paymentmethods = PaymentMethod::find($id);

        $paymentmethods->update($request->all());

        return redirect()->route('paymentmethods.index');
    }

    public function destroy($id)
    {
        $paymentmethods = PaymentMethod::find($id);
        $paymentmethods->delete();
        return redirect()->route('paymentmethods.index');
    }
}
