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
        // Drop the existing check constraint
        DB::statement("ALTER TABLE products DROP CONSTRAINT IF EXISTS products_type_check");
        // Add the new check constraint with 'supply'
        DB::statement("ALTER TABLE products ADD CONSTRAINT products_type_check CHECK (type::text IN ('single', 'combo', 'supply'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE products DROP CONSTRAINT IF EXISTS products_type_check");
        DB::statement("ALTER TABLE products ADD CONSTRAINT products_type_check CHECK (type::text IN ('single', 'combo'))");
    }
};
