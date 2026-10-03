<?php

namespace App\Http\Requests\Sale;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
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
            'product_id' => ['required', 'array', 'min:1'],
            'product_id.*' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'array', 'min:1'],
            'quantity.*' => ['required', 'numeric', 'min:1'],
            'price' => ['required', 'array', 'min:1'],
            'price.*' => ['required', 'numeric', 'min:0'],
            'total_price' => ['required', 'array', 'min:1'],
            'total_price.*' => ['required', 'numeric', 'min:0'],
            'total' => ['required', 'numeric', 'min:0'],
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
            'product_id.required' => 'Debe seleccionar al menos un producto.',
            'product_id.min' => 'Debe seleccionar al menos un producto.',
            'product_id.*.exists' => 'Uno de los productos seleccionados no existe.',
            'quantity.*.required' => 'La cantidad es obligatoria para cada producto.',
            'quantity.*.numeric' => 'La cantidad debe ser un número.',
            'quantity.*.min' => 'La cantidad debe ser al menos 1.',
            'total.required' => 'El total es obligatorio.',
            'total.numeric' => 'El total debe ser un número.',
        ];
    }
}



