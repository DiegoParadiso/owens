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
        Schema::table('products', function (Blueprint $table) {
            $table->string('category')->default('other');
        });

        DB::statement("ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category IN ('burger', 'extra', 'combo', 'other'))");
        
        // Update existing combos to have category 'combo'
        DB::table('products')->where('type', 'combo')->update(['category' => 'combo']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check");
        
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
