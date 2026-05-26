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
        $daysCount = max(1, min(30, (int) $request->query('days', 7)));
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = [];
        $responseTimeData = [];
        $tokenData = [];
        $days = [];

        $isSqlite = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'sqlite';
        $hourExpr = $isSqlite ? "cast(strftime('%H', created_at) as integer)" : "HOUR(created_at)";
        $dateExpr = $isSqlite ? "date(created_at)" : "DATE(created_at)";

        if ($daysCount == 1) {
            // Last 24 hours
            $startDate = Carbon::now()->subHours(23)->startOfHour();
            $endDate = Carbon::now()->endOfHour();

            $conversationsData = Conversation::where('user_id', $userId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw("$hourExpr as hr, COUNT(*) as count")
                ->groupByRaw($hourExpr)
                ->pluck('count', 'hr')
                ->toArray();

            $conversations = Conversation::where('user_id', $userId)->pluck('id');
            $tokensData = \App\Models\Message::whereIn('conversation_id', $conversations)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw("$hourExpr as hr, SUM(tokens) as total_tokens")
                ->groupByRaw($hourExpr)
                ->pluck('total_tokens', 'hr')
                ->toArray();

            $responseTimeDataRaw = \App\Models\Message::whereIn('conversation_id', $conversations)
                ->where('role', 'bot')
                ->whereNotNull('response_time_ms')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw("$hourExpr as hr, AVG(response_time_ms) as avg_response_time")
                ->groupByRaw($hourExpr)
                ->pluck('avg_response_time', 'hr')
                ->toArray();

            for ($i = 23; $i >= 0; $i--) {
                $hour = Carbon::now()->subHours($i);
                $hrVal = (int) $hour->format('H');

                $data[] = $conversationsData[$hrVal] ?? 0;
                $tokenData[] = (int) ($tokensData[$hrVal] ?? 0);
                
                $avgMs = $responseTimeDataRaw[$hrVal] ?? null;
                $responseTimeData[] = $avgMs !== null ? round($avgMs / 1000, 1) : null;

                $days[] = $hour->format('H:00');
            }
        } else {
            // Last N days
            $startDate = Carbon::today()->subDays($daysCount - 1)->startOfDay();
            $endDate = Carbon::now()->endOfDay();

            $conversationsData = Conversation::where('user_id', $userId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw("$dateExpr as date_label, COUNT(*) as count")
                ->groupByRaw($dateExpr)
                ->pluck('count', 'date_label')
                ->toArray();

            $conversations = Conversation::where('user_id', $userId)->pluck('id');
            $tokensData = \App\Models\Message::whereIn('conversation_id', $conversations)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw("$dateExpr as date_label, SUM(tokens) as total_tokens")
                ->groupByRaw($dateExpr)
                ->pluck('total_tokens', 'date_label')
                ->toArray();

            $responseTimeDataRaw = \App\Models\Message::whereIn('conversation_id', $conversations)
                ->where('role', 'bot')
                ->whereNotNull('response_time_ms')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw("$dateExpr as date_label, AVG(response_time_ms) as avg_response_time")
                ->groupByRaw($dateExpr)
                ->pluck('avg_response_time', 'date_label')
                ->toArray();

            for ($i = $daysCount - 1; $i >= 0; $i--) {
                $date = Carbon::today()->subDays($i);
                $dateStr = $date->toDateString();

                $data[] = $conversationsData[$dateStr] ?? 0;
                $tokenData[] = (int) ($tokensData[$dateStr] ?? 0);
                
                $avgMs = $responseTimeDataRaw[$dateStr] ?? null;
                $responseTimeData[] = $avgMs !== null ? round($avgMs / 1000, 1) : null;
                
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
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
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
