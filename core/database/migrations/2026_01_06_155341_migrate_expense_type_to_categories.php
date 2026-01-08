<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\ExpenseCategory;
use App\Models\Expense;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create default categories
        $categories = [
            ['name' => 'Servicios (Luz, Agua, Internet)', 'type' => 'fixed'],
            ['name' => 'Alquiler', 'type' => 'fixed'],
            ['name' => 'Mercadería / Proveedores', 'type' => 'variable'],
            ['name' => 'Mantenimiento', 'type' => 'variable'],
            ['name' => 'Limpieza', 'type' => 'fixed'],
        ];

        foreach ($categories as $category) {
            ExpenseCategory::create($category);
        }

        // Create generic categories for migrating existing data
        $gastosFijos = ExpenseCategory::create(['name' => 'Gastos Fijos (General)', 'type' => 'fixed']);
        $gastosVariables = ExpenseCategory::create(['name' => 'Gastos Variables (General)', 'type' => 'variable']);

        // Migrate existing expenses to categories based on their type
        Expense::where('type', 'fixed')->update(['category_id' => $gastosFijos->id]);
        Expense::where('type', 'variable')->update(['category_id' => $gastosVariables->id]);

        // Make category_id NOT NULL
        Schema::table('expenses', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable(false)->change();
        });

        // Drop the type column
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-add type column
        Schema::table('expenses', function (Blueprint $table) {
            $table->enum('type', ['fixed', 'variable'])->after('amount');
        });

        // Reverse migration: set type based on category
        $expenses = Expense::with('category')->get();
        foreach ($expenses as $expense) {
            if ($expense->category) {
                $expense->type = $expense->category->type;
                $expense->save();
            }
        }

        // Make category_id nullable again
        Schema::table('expenses', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->change();
        });

        // Remove categories
        ExpenseCategory::truncate();
    }
};
