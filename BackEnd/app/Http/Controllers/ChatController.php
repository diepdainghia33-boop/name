<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    /** AI service base URL */
    private string $aiServiceUrl = 'http://127.0.0.1:8001';

    public function getConversations()
    {
        $conversations = Conversation::where('user_id', Auth::id())
            ->orderBy('updated_at', 'desc')
            ->get();
        return response()->json($conversations);
    }

    public function getMessages($id)
    {
        $conversation = Conversation::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $messages = Message::where('conversation_id', $conversation->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'content'         => 'nullable|string|max:10000',
            'conversation_id' => 'nullable|integer',
            'image'           => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $userId         = Auth::id();
        $conversationId = $request->conversation_id;

        // ── Resolve or create conversation ────────────────────────────────────
        if ($conversationId) {
            $conversation = Conversation::where('id', $conversationId)
                ->where('user_id', $userId)
                ->firstOrFail();
        } else {
            $rawTitle = $request->input('content', 'New Chat');
            $title    = strlen($rawTitle) > 50
                ? mb_substr($rawTitle, 0, 47) . '...'
                : ($rawTitle ?: 'New Image Chat');

            $conversation   = Conversation::create(['user_id' => $userId, 'title' => $title]);
            $conversationId = $conversation->id;
        }

        // ── Handle image upload ────────────────────────────────────────────────
        $imagePath = null;
        $type      = 'text';

        if ($request->hasFile('image')) {
            $path      = $request->file('image')->store('chat_images', 'public');
            $imagePath = asset('storage/' . $path);
            $type      = 'image';
        }

        // ── Save user message ──────────────────────────────────────────────────
        $userMessage = Message::create([
            'conversation_id' => $conversationId,
            'content'         => $request->input('content'),
            'role'            => 'user',
            'type'            => $type,
            'image_path'      => $imagePath,
        ]);

        // ── Build conversation history for AI ──────────────────────────────────
        $history = Message::where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn ($m) => [
                'role'    => $m->role,   // 'user' or 'bot' — AI service maps bot→assistant
                'content' => $m->content ?? '',
            ])
            ->toArray();

        // ── Call AI service ────────────────────────────────────────────────────
        $aiText    = null;
        $aiTokens  = 0;

        try {
            $aiResponse = Http::timeout(30)->post("{$this->aiServiceUrl}/api/chat", [
                'history' => $history,
            ]);

            if ($aiResponse->successful()) {
                $aiData   = $aiResponse->json();
                $aiText   = $aiData['content']  ?? null;
                $aiTokens = $aiData['tokens']   ?? 0;
            } else {
                Log::warning('AI service returned non-2xx', ['status' => $aiResponse->status()]);
            }
        } catch (\Exception $e) {
            Log::error('AI service unreachable: ' . $e->getMessage());
        }

        // Fallback if AI service is down
        if (!$aiText) {
            $aiText = $imagePath
                ? "Tôi đã nhận được hình ảnh của bạn. Xin lỗi, dịch vụ AI đang bận — hãy thử lại sau."
                : "Xin lỗi, dịch vụ AI đang tạm thời không khả dụng. Hãy đảm bảo server AI (port 8001) đang chạy.";
        }

        // ── Save bot message ───────────────────────────────────────────────────
        $botMessage = Message::create([
            'conversation_id' => $conversationId,
            'content'         => $aiText,
            'role'            => 'bot',
            'type'            => 'text',
            'tokens'          => $aiTokens,
        ]);

        return response()->json([
            'conversation_id' => $conversationId,
            'user_message'    => $userMessage,
            'bot_message'     => $botMessage,
        ]);
    }

    public function deleteConversation($id)
    {
        $conversation = Conversation::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $conversation->delete();

        return response()->json(['message' => 'Conversation deleted successfully']);
    }
}
