<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function getTrends(Request $request)
    {
        $daysCount = $request->query('days', 7);
        $userId = Auth::id();

        $data = [];
        $responseTimeData = [];
        $tokenData = [];
        $days = [];

        if ($daysCount == 1) {
            // Last 24 hours
            for ($i = 23; $i >= 0; $i--) {
                $hour = Carbon::now()->subHours($i);
                $start = $hour->copy()->startOfHour();
                $end = $hour->copy()->endOfHour();

                $count = Conversation::where('user_id', $userId)
                    ->whereBetween('created_at', [$start, $end])
                    ->count();
                $data[] = $count;

                // Tokens
                $tokens = $this->calculateTotalTokens($userId, $start, $end);
                $tokenData[] = $tokens;

                // Avg response time
                $avgTime = $this->calculateAvgResponseTime($userId, $start, $end);
                $responseTimeData[] = $avgTime;

                $days[] = $hour->format('H:00');
            }
        } else {
            // Last N days
            for ($i = $daysCount - 1; $i >= 0; $i--) {
                $date = Carbon::today()->subDays($i);
                $start = $date->copy()->startOfDay();
                $end = $date->copy()->endOfDay();

                $count = Conversation::where('user_id', $userId)
                    ->whereDate('created_at', $date)
                    ->count();
                $data[] = $count;

                // Tokens
                $tokens = $this->calculateTotalTokens($userId, $start, $end);
                $tokenData[] = $tokens;

                // Avg response time
                $avgTime = $this->calculateAvgResponseTime($userId, $start, $end);
                $responseTimeData[] = $avgTime;
                
                if ($daysCount <= 7) {
                    $days[] = $date->format('D');
                } else {
                    $days[] = $date->format('d/m');
                }
            }
        }

        // Calculate Intent Distribution
        $conversations = Conversation::where('user_id', $userId)->pluck('id');
        $intentCounts = \App\Models\Message::whereIn('conversation_id', $conversations)
            ->whereNotNull('type')
            ->groupBy('type')
            ->selectRaw('type, count(*) as count')
            ->get();

        $intents = [];
        $colors = ['#60a5fa', '#f472b6', '#22d3ee', '#f59e0b', '#10b981', '#9ca3af'];
        $totalMessages = $intentCounts->sum('count');

        foreach ($intentCounts as $index => $item) {
            $intents[] = [
                'name' => ucfirst($item->type),
                'value' => $totalMessages > 0 ? round(($item->count / $totalMessages) * 100) : 0,
                'color' => $colors[$index % count($colors)]
            ];
        }

        // Default intents if empty
        if (empty($intents)) {
            $intents = [
                ['name' => 'General Chat', 'value' => 100, 'color' => '#60a5fa']
            ];
        }

        // Calculate current latency and health from real response-time data only.
        $avgLatency = $this->calculateAvgResponseTime($userId, \Carbon\Carbon::now()->subDays(7), \Carbon\Carbon::now());
        $healthScore = $avgLatency !== null
            ? round(max(0, min(100, 100 - max(0, ($avgLatency - 1) * 20))), 1)
            : null;
        
        // Example: Trigger warning if tokens for the period are high
        $totalTokens = array_sum(array_column($tokenData, 'value'));
        if ($totalTokens > 50000) {
            \App\Models\Notification::create([
                'user_id' => $userId,
                'title' => 'High Token Usage',
                'message' => 'Your system has consumed over 50,000 tokens in the last 7 days.',
                'type' => 'warning',
                'icon' => 'warning',
                'is_read' => false
            ]);
        }

        return response()->json([
            'data' => $data,
            'responseTimeData' => $responseTimeData,
            'tokenData' => $tokenData,
            'days' => $days,
            'intents' => $intents,
            'health' => $healthScore,
            'latency' => $avgLatency
        ]);
    }

    private function calculateTotalTokens($userId, $start, $end)
    {
        $conversations = Conversation::where('user_id', $userId)->pluck('id');
        return \App\Models\Message::whereIn('conversation_id', $conversations)
            ->whereBetween('created_at', [$start, $end])
            ->sum('tokens');
    }

    private function calculateAvgResponseTime($userId, $start, $end)
    {
        $conversations = Conversation::where('user_id', $userId)->pluck('id');

        $avgMs = \App\Models\Message::whereIn('conversation_id', $conversations)
            ->where('role', 'bot')
            ->whereNotNull('response_time_ms')
            ->whereBetween('created_at', [$start, $end])
            ->avg('response_time_ms');

        if ($avgMs === null) {
            return null;
        }

        return round($avgMs / 1000, 1);
    }
}
