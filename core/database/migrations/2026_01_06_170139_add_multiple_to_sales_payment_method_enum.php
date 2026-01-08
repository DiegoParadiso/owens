<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For PostgreSQL, we need to drop and recreate the constraint
        DB::statement("ALTER TABLE sales DROP CONSTRAINT IF EXISTS sales_payment_method_check");
        DB::statement("ALTER TABLE sales ADD CONSTRAINT sales_payment_method_check CHECK (payment_method IN ('cash', 'debit_card', 'credit_card', 'transfer', 'qr', 'multiple'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE sales DROP CONSTRAINT IF EXISTS sales_payment_method_check");
        DB::statement("ALTER TABLE sales ADD CONSTRAINT sales_payment_method_check CHECK (payment_method IN ('cash', 'debit_card', 'credit_card', 'transfer', 'qr'))");
    }
};
