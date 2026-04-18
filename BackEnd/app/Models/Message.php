<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id', 'content', 'role', 'type',
        'image_path', 'file_path', 'file_type', 'search_mode', 'tokens'
    ];
    protected $touches = ['conversation'];
    protected $attributes = [
        'tokens' => 0,
        'search_mode' => false,
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
}
