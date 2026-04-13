<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blueprint extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'title', 'description', 'type'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
