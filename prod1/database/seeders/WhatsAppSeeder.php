<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WhatsAppMessage;
use App\Models\Setting;
use Carbon\Carbon;

class WhatsAppSeeder extends Seeder
{
    public function run()
    {
        // 1. Ensure we have a token (Fake one for testing)
        Setting::updateOrCreate(
            ['key' => 'whatsapp_access_token'],
            ['value' => 'demo_token_123456789']
        );

        // 2. Create some dummy messages
        $messages = [
            // Conversation 1: Juan Perez
            [
                'wa_id' => 'msg_001',
                'from_number' => '5491133334444',
                'from_name' => 'Juan Perez',
                'body' => 'Hola, quisiera hacer un pedido',
                'type' => 'text',
                'status' => 'received',
                'wa_timestamp' => Carbon::now()->subHours(2)->format('Y-m-d H:i:s'),
            ],
            [
                'wa_id' => 'msg_002',
                'from_number' => '5491133334444',
                'from_name' => 'Juan Perez',
                'body' => 'Claro Juan, ¿qué te gustaría pedir?',
                'type' => 'text',
                'status' => 'sent',
                'wa_timestamp' => Carbon::now()->subHours(1)->format('Y-m-d H:i:s'), // Response (simulated as inbound for now as we group by from_number, but ideally distinct)
            ],
             // NOTE: Our controller groups by 'from_number' and doesn't seemingly distinguish 'sent' messages having a different 'from' in the grouping logic? 
             // Actually, the controller logic groups by `from_number`. If we send a message, it likely shouldn't have `from_number` as the customer's number unless we are just storing it that way for conversation association.
             // Looking at controller: $messages->groupBy('from_number'). 
             // If we reply, we need to ensure the `from_number` remains the customer's number in this context OR the grouping logic handles it.
             // For this simple schema, usually both sent/received share a common 'conversation_id' or we stick to the customer number.
             // Let's assume for this simple implementation we store `from_number` as the conversation identifier (customer).
             
            [
                'wa_id' => 'msg_003',
                'from_number' => '5491133334444',
                'from_name' => 'Juan Perez',
                'body' => 'Una hamburguesa completa con papas',
                'type' => 'text',
                'status' => 'received',
                'wa_timestamp' => Carbon::now()->subMinutes(30)->format('Y-m-d H:i:s'),
            ],

            // Conversation 2: Maria Gomez
            [
                'wa_id' => 'msg_004',
                'from_number' => '5491155556666',
                'from_name' => 'Maria Gomez',
                'body' => 'Buenas tardes, ¿están abiertos?',
                'type' => 'text',
                'status' => 'received',
                'wa_timestamp' => Carbon::now()->subDay()->format('Y-m-d H:i:s'),
            ],
        ];

        foreach ($messages as $msg) {
            WhatsAppMessage::firstOrCreate(
                ['wa_id' => $msg['wa_id']],
                $msg
            );
        }
        
        $this->command->info('Configuración de WhatsApp Demo cargada correctamente.');
    }
}
