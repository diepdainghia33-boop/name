<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function getConversations()
    {
        $conversations = Conversation::where('user_id', Auth::id())
            ->orderBy('updated_at', 'desc')
            ->get();
        return response()->json($conversations);
    }

    public function getMessages($conversationId)
    {
        $messages = Message::where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get();
        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'content' => 'nullable|string',
            'conversation_id' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $userId = Auth::id();
        $conversationId = $request->conversation_id;

        // Create new conversation if none provided
        if (!$conversationId) {
            $title = $request->content ? substr($request->content, 0, 50) . '...' : 'Image Session';
            $conversation = Conversation::create([
                'user_id' => $userId,
                'title' => $title
            ]);
            $conversationId = $conversation->id;
        }

        $imagePath = null;
        $type = 'text';

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('chat_images', 'public');
            $imagePath = asset('storage/' . $path);
            $type = 'image';
        }

        // Save user message
        $userMessage = Message::create([
            'conversation_id' => $conversationId,
            'content' => $request->content,
            'role' => 'user',
            'type' => $type,
            'image_path' => $imagePath
        ]);

        // MOCK BOT RESPONSE
        $botMessage = Message::create([
            'conversation_id' => $conversationId,
            'content' => $imagePath ? "I've received your image. Analyzing architecture..." : "I am Architect AI. How can I assist you with your designs today?",
            'role' => 'bot',
            'type' => 'text'
        ]);

        return response()->json([
            'conversation_id' => $conversationId,
            'user_message' => $userMessage,
            'bot_message' => $botMessage
        ]);
    }
}
