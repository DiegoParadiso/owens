<?php

namespace App\Http\Controllers;

use App\Models\WhatsAppMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class WhatsAppController extends Controller
{
    /**
     * Display the WhatsApp chat interface.
     */
    public function index()
    {
        // Check if WhatsApp token exists
        $token = \App\Models\Setting::where('key', 'whatsapp_access_token')->first();

        if (!$token) {
            return Inertia::render('WhatsApp/Connect');
        }

        // Get all messages ordered by time
        $messages = WhatsAppMessage::orderBy('wa_timestamp', 'asc')->get();

        // Group by conversation (from_number)
        $conversations = $messages->groupBy('from_number')->map(function ($msgs, $number) {
            $lastMsg = $msgs->last();
            return [
                'number' => $number,
                'name' => $lastMsg->from_name, // Estimate name from last msg
                'last_message' => $lastMsg->body,
                'timestamp' => $lastMsg->wa_timestamp,
                'unread_count' => $msgs->where('status', 'received')->count(),
            ];
        })->sortByDesc('timestamp')->values();

        return Inertia::render('WhatsApp/Index', [
            'conversations' => $conversations,
            'messages' => $messages
        ]);
    }

    public function storeToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ], [
            'token.required' => 'Por favor, ingresa el token de acceso.',
            'token.string' => 'El token debe ser una cadena de texto válida.',
        ]);

        \App\Models\Setting::updateOrCreate(
            ['key' => 'whatsapp_access_token'],
            ['value' => $request->token]
        );

        return redirect()->route('whatsapp.index')->with('success', 'Token guardado correctamente');
    }

    /**
     * Remove the connection token.
     */
    public function logout()
    {
        \App\Models\Setting::where('key', 'whatsapp_access_token')->delete();
        return redirect()->route('whatsapp.index');
    }

    /**
     * Handle Webhook Verification (GET).
     */
    public function verifyWebhook(Request $request)
    {
        $verifyToken = env('WHATSAPP_VERIFY_TOKEN', 'owens_token_secure');

        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        if ($mode && $token) {
            if ($mode === 'subscribe' && $token === $verifyToken) {
                return response($challenge, 200);
            } else {
                return response('Forbidden', 403);
            }
        }

        return response('Bad Request', 400);
    }

    /**
     * Handle Incoming Messages (POST).
     */
    public function handleWebhook(Request $request)
    {
        try {
            $body = $request->all();
            Log::info('WhatsApp Webhook Headers: ', $request->headers->all());
            Log::info('WhatsApp Webhook Body: ' . json_encode($body));

            // Check if it's a message object
            if (isset($body['entry'][0]['changes'][0]['value']['messages'])) {
                $messages = $body['entry'][0]['changes'][0]['value']['messages'];
                $contact = $body['entry'][0]['changes'][0]['value']['contacts'][0] ?? null;

                foreach ($messages as $message) {
                    // Only handle text for now
                    if (isset($message['text'])) {
                        WhatsAppMessage::create([
                            'wa_id' => $message['id'],
                            'from_number' => $message['from'],
                            'from_name' => $contact ? $contact['profile']['name'] : null,
                            'body' => $message['text']['body'],
                            'type' => $message['type'],
                            'wa_timestamp' => date('Y-m-d H:i:s', $message['timestamp']),
                            'status' => 'received',
                        ]);
                    }
                }
            }

            return response('EVENT_RECEIVED', 200);

        } catch (\Exception $e) {
            Log::error('WhatsApp Webhook Error: ' . $e->getMessage());
            return response('Internal Server Error', 500);
        }
    }
}
