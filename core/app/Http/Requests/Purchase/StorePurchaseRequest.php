<?php

namespace App\Http\Requests\Purchase;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequest extends FormRequest
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
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'date' => ['required', 'date'],
            'product_id' => ['required', 'array', 'min:1'],
            'product_id.*' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'array', 'min:1'],
            'quantity.*' => ['required', 'integer', 'min:1'],
            'unit_cost' => ['required', 'array', 'min:1'],
            'unit_cost.*' => ['required', 'numeric', 'min:0'],
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
            'supplier_id.required' => 'Debe seleccionar un proveedor.',
            'supplier_id.exists' => 'El proveedor seleccionado no existe.',
            'date.required' => 'La fecha de compra es obligatoria.',
            'date.date' => 'La fecha debe ser una fecha válida.',
            'product_id.required' => 'Debe seleccionar al menos un producto.',
            'product_id.min' => 'Debe seleccionar al menos un producto.',
            'product_id.*.exists' => 'Uno de los productos seleccionados no existe.',
            'quantity.*.required' => 'La cantidad es obligatoria para cada producto.',
            'quantity.*.integer' => 'La cantidad debe ser un número entero.',
            'quantity.*.min' => 'La cantidad debe ser al menos 1.',
            'unit_cost.*.required' => 'El costo unitario es obligatorio para cada producto.',
            'unit_cost.*.numeric' => 'El costo unitario debe ser un número.',
            'unit_cost.*.min' => 'El costo unitario no puede ser negativo.',
        ];
    }
}

