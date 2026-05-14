<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id', 'content', 'role', 'type', 'bill_id',
        'image_path', 'file_path', 'file_type', 'search_mode', 'tokens', 'feedback', 'response_time_ms'
    ];
    protected $touches = ['conversation'];
    protected $attributes = [
        'tokens' => 0,
        'search_mode' => false,
    ];
    protected $casts = [
        'search_mode' => 'boolean',
        'tokens' => 'integer',
        'feedback' => 'integer',
        'response_time_ms' => 'integer',
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }
}
