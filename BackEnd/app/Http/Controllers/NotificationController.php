<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        
        $notifications = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function($notif) {
                return [
                    'id' => $notif->id,
                    'title' => $notif->title,
                    'message' => $notif->message,
                    'type' => $notif->type,
                    'icon' => $notif->icon,
                    'is_read' => $notif->is_read,
                    'time' => $notif->created_at->diffForHumans()
                ];
            });

        return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->update(['is_read' => true]);
            
        return response()->json(['success' => true]);
    }

    public function clearAll()
    {
        Notification::where('user_id', Auth::id())->delete();
        return response()->json(['success' => true]);
    }
}
