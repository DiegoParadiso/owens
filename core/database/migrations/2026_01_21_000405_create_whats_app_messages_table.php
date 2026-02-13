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
        Schema::create('whats_app_messages', function (Blueprint $table) {
            $table->id();
            $table->string('wa_id')->unique(); // ID único del mensaje de WhatsApp
            $table->string('from_number');     // Número del remitente (sin +)
            $table->string('from_name')->nullable(); // Nombre del remitente
            $table->text('body')->nullable();  // Contenido del mensaje
            $table->string('media_url')->nullable(); // Para imágenes/documentos (futuro)
            $table->string('type')->default('text'); // text, image, document, etc.
            $table->string('status')->default('received'); // received, read, replied
            $table->timestamp('wa_timestamp')->nullable(); // Timestamp original de WhatsApp
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whats_app_messages');
    }
};
