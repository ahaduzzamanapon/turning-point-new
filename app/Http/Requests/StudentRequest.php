<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'candidate_full_name' => 'required|string|max:255',
            'mobile_number' => 'required|string|max:20',
            'email' => 'required|string|email|max:255|unique:students,email,' . ($this->student->id ?? ''),
            'full_address' => 'required|string',
            'course_interested_id' => 'required|integer|exists:courses,id',
            'bach_interested_id' => 'required|integer|exists:batches,id',
            'payment_method_id' => 'required|integer|exists:payment_methods,id',
            'sender_mobile_number' => 'required|string|max:20',
            'amount_sent' => 'required|numeric',
            'transaction_id' => 'required|string|max:255',
            'facebook_profile_link' => 'nullable|string|max:255',
            'representative_id' => 'required|integer|exists:representatives,id',
        ];
    }
}