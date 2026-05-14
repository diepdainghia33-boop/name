<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'file_url',
        'invoice_number',
        'store_name',
        'purchase_date',
        'total_amount',
        'currency',
        'status',
        'ocr_text',
        'extracted_data',
        'confidence_score',
    ];

    protected function casts(): array
    {
        return [
            'purchase_date' => 'datetime',
            'total_amount' => 'decimal:2',
            'confidence_score' => 'decimal:2',
            'extracted_data' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(BillItem::class);
    }

    public function message()
    {
        return $this->hasOne(Message::class);
    }
}
