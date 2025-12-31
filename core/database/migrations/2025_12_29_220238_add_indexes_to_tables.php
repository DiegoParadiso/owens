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
        Schema::table('sales', function (Blueprint $table) {
            $table->index('sale_date'); // Optimized for filtering by date
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('type'); // Optimized for filtering by type (single/combo)
            $table->index('name'); // Optimized for search
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex(['sale_date']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropIndex(['name']);
        });
    }
};
