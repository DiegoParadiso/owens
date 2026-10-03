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
            $table->string('base_unit')->nullable()->after('category')->comment('Technical unit (g, ml)');
            $table->decimal('usage_factor', 10, 4)->default(1)->after('usage_unit')->comment('Factor to convert Usage Unit to Base Unit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['base_unit', 'usage_factor']);
        });
    }
};
