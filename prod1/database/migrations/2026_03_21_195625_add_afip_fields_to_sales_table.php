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
            $table->string('afip_cae', 20)->nullable()->after('payment_method');
            $table->date('afip_cae_fch_vto')->nullable()->after('afip_cae');
            $table->integer('afip_cbte_nro')->nullable()->after('afip_cae_fch_vto');
            $table->integer('afip_cbte_tipo')->nullable()->after('afip_cbte_nro');
            $table->string('afip_resultado', 10)->nullable()->after('afip_cbte_tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['afip_cae', 'afip_cae_fch_vto', 'afip_cbte_nro', 'afip_cbte_tipo', 'afip_resultado']);
        });
    }
};
