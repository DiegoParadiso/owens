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
        Schema::table('products', function (Blueprint $table) {
            $table->string('usage_unit')->nullable()->change();
            $table->decimal('usage_factor', 10, 4)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // We can't easily revert to NOT NULL without knowing the data state,
            // but we can try to revert to default behavior if needed, or just leave as is.
            // For strict reversion:
            // $table->string('usage_unit')->nullable(false)->change();
            // $table->decimal('usage_factor', 10, 4)->nullable(false)->default(1)->change();
        });
    }
};
