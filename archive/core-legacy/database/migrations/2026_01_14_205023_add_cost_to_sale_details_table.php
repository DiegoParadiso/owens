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
        Schema::table('sale_details', function (Blueprint $table) {
            $table->decimal('cost', 15, 2)->default(0)->after('price');
        });

        // Backfill existing records with current product cost
        // Standard SQL Subquery (Cross-compatible safe bet)
        DB::statement("
            UPDATE sale_details 
            SET cost = COALESCE((SELECT cost FROM products WHERE products.id = sale_details.product_id), 0)
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_details', function (Blueprint $table) {
            $table->dropColumn('cost');
        });
    }
};
