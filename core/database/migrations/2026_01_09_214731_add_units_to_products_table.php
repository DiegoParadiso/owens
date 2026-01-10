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
            $table->string('purchase_unit')->nullable()->after('category'); // e.g., Pack, Caja
            $table->string('usage_unit')->nullable()->after('purchase_unit'); // e.g., Unidad, Gramo
            $table->decimal('conversion_factor', 10, 4)->default(1)->after('usage_unit'); // e.g., 8 (1 Pack = 8 Unidades)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['purchase_unit', 'usage_unit', 'conversion_factor']);
        });
    }
};
