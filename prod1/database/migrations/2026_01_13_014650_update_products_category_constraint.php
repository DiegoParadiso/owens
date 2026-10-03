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
        // Drop the existing constraint
        DB::statement("ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check");

        // Add the new constraint with 'production_formula' included
        DB::statement("ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category IN ('burger', 'combo', 'extra', 'other', 'production_formula'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original constraint (assuming previous values without production_formula)
        DB::statement("ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check");
        DB::statement("ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category IN ('burger', 'combo', 'extra', 'other'))");
    }
};
