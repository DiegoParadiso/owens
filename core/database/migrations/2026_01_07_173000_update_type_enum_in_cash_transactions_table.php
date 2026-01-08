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
        // For PostgreSQL, we need to add the new values to the enum type
        // Note: PostgreSQL does not support removing values from an enum easily, so down() is tricky.
        // We will just add the values.
        DB::statement("ALTER TYPE cash_transactions_type_enum ADD VALUE 'sale'");
        DB::statement("ALTER TYPE cash_transactions_type_enum ADD VALUE 'purchase'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // PostgreSQL does not support removing values from an enum type easily.
        // We would need to recreate the type or table. 
        // For now, we will leave it as is or throw an exception if strict rollback is needed.
        // DB::statement("..."); 
    }
};
