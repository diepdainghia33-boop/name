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

        return response()->json([
            'message' => 'Preferences updated successfully',
            'preferences' => $user->preferences
        ]);
    }

    public function exportData(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
            ],
            'preferences' => $user->preferences,
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
        \Illuminate\Support\Facades\Cache::flush();

        return response()->json([
            'message' => 'Cache cleared successfully.'
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