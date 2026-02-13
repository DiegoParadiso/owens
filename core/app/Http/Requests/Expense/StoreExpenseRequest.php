<?php

namespace App\Http\Requests\Expense;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
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
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'type' => ['required', 'in:fixed,variable'],
            'date' => ['required', 'date'],
            'payment_method' => ['required', 'in:cash,external'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'description.required' => 'La descripción del gasto es obligatoria.',
            'description.max' => 'La descripción no puede exceder 255 caracteres.',
            'amount.required' => 'El monto del gasto es obligatorio.',
            'amount.numeric' => 'El monto debe ser un número.',
            'amount.min' => 'El monto no puede ser negativo.',
            'type.required' => 'El tipo de gasto es obligatorio.',
            'type.in' => 'El tipo de gasto debe ser fijo o variable.',
            'date.required' => 'La fecha del gasto es obligatoria.',
            'date.date' => 'La fecha debe ser una fecha válida.',
            'payment_method.required' => 'El método de pago es obligatorio.',
            'payment_method.in' => 'El método de pago debe ser efectivo o externo.',
        ];
    }
}



