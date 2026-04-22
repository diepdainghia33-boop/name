<?php

namespace App\Helpers;

use App\Models\Notification;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class NotificationHelper
{
    public static function send($userId, $title, $message, $type = 'info', $icon = 'notifications')
    {
        // 1. Log to ActivityLog (Always works)
        ActivityLog::create([
            'user_id' => $userId,
            'message' => $title . ': ' . $message,
            'type' => $type
        ]);

        // 2. Try to save to Notifications table
        try {
            if (class_exists(Notification::class)) {
                Notification::create([
                    'user_id' => $userId,
                    'title' => $title,
                    'message' => $message,
                    'type' => $type,
                    'icon' => $icon,
                    'is_read' => false
                ]);
            }
        } catch (\Exception $e) {
            // Table might not exist yet, ignore
        }
    }
}
