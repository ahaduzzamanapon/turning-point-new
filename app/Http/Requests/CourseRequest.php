<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|Required',
            'amount' => 'required|Required',
            'start_date' => 'required|Required',
            'end_date' => 'required|Required',
            'status' => 'required|Required',
            'description' => 'nullable'
        ];
    }
}
