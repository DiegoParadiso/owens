<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreComboRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'components' => ['required', 'array', 'min:1'],
            'components.*.product_id' => ['required', 'exists:products,id'],
            'components.*.quantity' => ['required', 'numeric', 'min:1'],
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
            'name.required' => 'El nombre del combo es obligatorio.',
            'price.required' => 'El precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número.',
            'components.required' => 'Debe agregar al menos un componente al combo.',
            'components.min' => 'Debe agregar al menos un componente al combo.',
            'components.*.product_id.required' => 'Cada componente debe tener un producto seleccionado.',
            'components.*.product_id.exists' => 'Uno de los productos seleccionados no existe.',
            'components.*.quantity.required' => 'Cada componente debe tener una cantidad.',
            'components.*.quantity.min' => 'La cantidad de cada componente debe ser al menos 1.',
        ];
    }
}



