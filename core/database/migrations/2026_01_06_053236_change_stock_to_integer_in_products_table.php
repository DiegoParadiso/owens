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
        // Convertir valores decimales a enteros (redondeando)
        DB::statement('UPDATE products SET stock = ROUND(stock)');
        
        // Cambiar el tipo de columna a integer
        Schema::table('products', function (Blueprint $table) {
            $table->integer('stock')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir a decimal
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('stock', 10, 2)->default(0)->change();
        });
    }
};
