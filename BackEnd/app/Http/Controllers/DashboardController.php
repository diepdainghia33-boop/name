<?php

namespace App\Http\Controllers;

use App\Models\Blueprint;
use App\Models\ActivityLog;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function getData()
    {
        $userId = Auth::id();

        $blueprints = Blueprint::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        $logs = ActivityLog::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        // Get user's conversations
        $conversationIds = Conversation::where('user_id', $userId)->pluck('id');

        // Count total messages from user's conversations
        $totalMessages = Message::whereIn('conversation_id', $conversationIds)->count();

        // Metrics
        $metrics = [
            'health' => 99.95,
            'tokens' => 1450200,
            'latency' => 38,
            'projects' => Blueprint::where('user_id', $userId)->count(),
            'conversations' => $conversationIds->count(),
            'total_messages' => $totalMessages,
        ];

        return response()->json([
            'blueprints' => $blueprints,
            'logs' => $logs,
            'metrics' => $metrics
        ]);
    }

    public function addLog(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'type' => 'nullable|string'
        ]);

        $log = ActivityLog::create([
            'user_id' => Auth::id(),
            'message' => $request->message,
            'type' => $request->type ?? 'info'
        ]);

        return response()->json($log);
    }
}
