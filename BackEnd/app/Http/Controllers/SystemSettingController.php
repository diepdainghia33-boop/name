<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SystemSettingController extends Controller
{
    public function index()
    {
        // Only admin should be able to see all settings, but for this project 
        // we'll allow any authenticated user to manage AI keys for simplicity.
        $settings = Setting::where('group', 'ai_service')->get();
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($request->settings as $item) {
            Setting::updateOrCreate(
                ['key' => $item['key']],
                ['value' => $item['value'], 'group' => 'ai_service']
            );
        }

        return response()->json(['message' => 'AI Service settings updated successfully']);
    }
}
