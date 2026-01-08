<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change 'type' column to string to avoid enum constraints and allow new values easily
        Schema::table('cash_transactions', function (Blueprint $table) {
            // We can't easily drop the enum type in Laravel schema builder for Postgres, 
            // but changing to string usually handles it.
            // However, we might need to drop the check constraint first if it exists.
            // DB::statement('ALTER TABLE cash_transactions DROP CONSTRAINT IF EXISTS cash_transactions_type_check');
            
            // Changing column type
            $table->string('type')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverting to enum might be tricky if we have values not in the enum.
        // We will leave it as string or try to revert.
        Schema::table('cash_transactions', function (Blueprint $table) {
             // $table->enum('type', ['income', 'expense', 'sale', 'purchase'])->change();
        });
    }
};
