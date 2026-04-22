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

        // Calculate Satisfaction
        $pos = Message::whereIn('conversation_id', $conversationIds)->where('feedback', 1)->count();
        $neg = Message::whereIn('conversation_id', $conversationIds)->where('feedback', -1)->count();
        $totalFeedback = $pos + $neg;
        $satisfaction = $totalFeedback > 0
            ? 1 + (($pos / $totalFeedback) * 4)
            : null;

        // Calculate Total Tokens
        $totalTokens = Message::whereIn('conversation_id', $conversationIds)->sum('tokens');

        // Calculate Average Latency (Response Time)
        $avgLatency = $this->calculateAvgLatency($conversationIds);

        // Calculate 7-day Trends
        $trends = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = \Carbon\Carbon::today()->subDays($i);
            $count = Conversation::where('user_id', $userId)
                ->whereDate('created_at', $date)
                ->count();
            $trends[] = [
                'day' => $date->format('D'),
                'count' => $count
            ];
        }

        // Calculate 7-day Trends for Blueprints
        $blueprintTrends = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = \Carbon\Carbon::today()->subDays($i);
            $count = Blueprint::where('user_id', $userId)
                ->whereDate('created_at', $date)
                ->count();
            $blueprintTrends[] = [
                'day' => $date->format('D'),
                'count' => $count
            ];
        }

        // Calculate 7-day Trends for Activity Logs
        $activityTrends = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = \Carbon\Carbon::today()->subDays($i);
            $count = ActivityLog::where('user_id', $userId)
                ->whereDate('created_at', $date)
                ->count();
            $activityTrends[] = [
                'day' => $date->format('D'),
                'count' => $count
            ];
        }

        // Calculate Health Score from real signals only.
        // If there is no activity or telemetry yet, keep it null instead of faking 100%.
        $healthScore = $this->calculateHealthScore($logs, $satisfaction, $avgLatency);

        // Metrics
        $metrics = [
            'health' => $healthScore,
            'tokens' => $totalTokens,
            'latency' => $avgLatency,
            'projects' => Blueprint::where('user_id', $userId)->count(),
            'conversations' => $conversationIds->count(),
            'total_messages' => $totalMessages,
            'satisfaction' => $satisfaction !== null ? round($satisfaction, 1) : null,
        ];

        return response()->json([
            'blueprints' => $blueprints,
            'logs' => $logs,
            'metrics' => $metrics,
            'trends' => $trends,
            'blueprintTrends' => $blueprintTrends,
            'activityTrends' => $activityTrends
        ]);
    }

    private function calculateAvgLatency($conversationIds)
    {
        $avgMs = Message::whereIn('conversation_id', $conversationIds)
            ->where('role', 'bot')
            ->whereNotNull('response_time_ms')
            ->avg('response_time_ms');

        if ($avgMs === null) {
            return null;
        }

        return round($avgMs / 1000, 1);
    }

    private function calculateHealthScore($logs, ?float $satisfaction, ?float $avgLatency)
    {
        $components = [];

        $totalLogs = $logs->count();
        if ($totalLogs > 0) {
            $errorCount = $logs->where('type', 'error')->count();
            $warningCount = $logs->where('type', 'warning')->count();

            $logPenalty = (($errorCount / $totalLogs) * 70) + (($warningCount / $totalLogs) * 25);
            $logScore = max(0, 100 - $logPenalty);

            $components[] = [
                'score' => $logScore,
                'weight' => 0.5,
            ];
        }

        if ($avgLatency !== null) {
            $latencyPenalty = max(0, ($avgLatency - 1) * 20);
            $latencyScore = max(0, 100 - $latencyPenalty);

            $components[] = [
                'score' => $latencyScore,
                'weight' => 0.2,
            ];
        }

        if ($satisfaction !== null) {
            $satisfactionScore = (($satisfaction - 1) / 4) * 100;

            $components[] = [
                'score' => max(0, min(100, $satisfactionScore)),
                'weight' => 0.3,
            ];
        }

        if (empty($components)) {
            return null;
        }

        $weightedTotal = 0;
        $totalWeight = 0;

        foreach ($components as $component) {
            $weightedTotal += $component['score'] * $component['weight'];
            $totalWeight += $component['weight'];
        }

        return round(max(0, min(100, $weightedTotal / $totalWeight)), 1);
    }

    public function addLog(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'type' => 'nullable|string'
        ]);

        $userId = Auth::id();
        $message = $request->message;
        $type = $request->type ?? 'info';

        $log = ActivityLog::create([
            'user_id' => $userId,
            'message' => $message,
            'type' => $type
        ]);

        // Create a real notification
        \App\Models\Notification::create([
            'user_id' => $userId,
            'title' => $type === 'error' ? 'System Alert' : 'Activity Update',
            'message' => $message,
            'type' => $type,
            'icon' => $type === 'error' ? 'report_problem' : 'notifications',
            'is_read' => false
        ]);

        return response()->json($log);
    }
}
