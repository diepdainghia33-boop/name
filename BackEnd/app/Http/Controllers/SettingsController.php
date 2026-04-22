<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $preferences = $user->preferences ?? $this->getDefaultPreferences();

        return response()->json([
            'preferences' => $preferences
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'preferences' => 'required|array',
        ]);

        $currentPreferences = $user->preferences ?? [];
        $mergedPreferences = array_merge($currentPreferences, $request->preferences);

        $user->preferences = $mergedPreferences;
        $user->save();

        \App\Models\Notification::create([
            'user_id' => $user->id,
            'title' => 'Preferences Updated',
            'message' => 'Your system preferences have been successfully synchronized.',
            'type' => 'success',
            'icon' => 'settings',
            'is_read' => false
        ]);

        return response()->json([
            'message' => 'Preferences updated successfully',
            'preferences' => $user->preferences
        ]);
    }

    public function exportData(Request $request)
    {
        $user = $request->user();
        $chatHistory = $user->conversations()->with('messages')->get();

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
            ],
            'preferences' => $user->preferences,
            'chat_history' => $chatHistory,
            'exported_at' => now()->toIso8601String()
        ]);
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'confirm_email' => 'required|email'
        ]);

        $user = $request->user();

        if ($request->confirm_email !== $user->email) {
            return response()->json([
                'message' => 'Email confirmation does not match.'
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully.'
        ]);
    }

    public function clearCache(Request $request)
    {
        $user = $request->user();
        
        // Clear system cache (optional/aggressive)
        \Illuminate\Support\Facades\Cache::flush();
        
        // Clear user-specific activity logs
        \App\Models\ActivityLog::where('user_id', $user->id)->delete();

        \App\Models\Notification::create([
            'user_id' => $user->id,
            'title' => 'System Cleanup',
            'message' => 'Cache and activity logs have been cleared successfully.',
            'type' => 'warning',
            'icon' => 'cleaning_services',
            'is_read' => false
        ]);

        return response()->json([
            'message' => 'System cache and activity logs cleared successfully.'
        ]);
    }

    private function getDefaultPreferences()
    {
        return [
            'theme' => 'dark',
            'notifications' => [
                'email' => true,
                'desktop' => true,
                'sound' => false
            ],
            'language' => 'en',
            'timezone' => 'UTC',
            'date_format' => 'MDY'
        ];
    }
}