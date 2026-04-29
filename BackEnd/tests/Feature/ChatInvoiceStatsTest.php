<?php

namespace Tests\Feature;

use App\Models\Bill;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ChatInvoiceStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_monthly_invoice_total_from_database(): void
    {
        $user = User::factory()->create();

        Bill::create([
            'user_id' => $user->id,
            'file_url' => 'storage/bills/march-1.jpg',
            'store_name' => 'Store A',
            'purchase_date' => Carbon::create(2026, 3, 5, 10, 0, 0),
            'total_amount' => 120000,
            'currency' => 'VND',
            'status' => 'done',
            'ocr_text' => 'sample ocr text',
            'extracted_data' => ['store_name' => 'Store A'],
            'confidence_score' => 98.5,
        ]);

        Bill::create([
            'user_id' => $user->id,
            'file_url' => 'storage/bills/march-2.jpg',
            'store_name' => 'Store B',
            'purchase_date' => Carbon::create(2026, 3, 18, 10, 0, 0),
            'total_amount' => 230000,
            'currency' => 'VND',
            'status' => 'done',
            'ocr_text' => 'sample ocr text',
            'extracted_data' => ['store_name' => 'Store B'],
            'confidence_score' => 91.2,
        ]);

        Bill::create([
            'user_id' => $user->id,
            'file_url' => 'storage/bills/march-processing.jpg',
            'store_name' => 'Store C',
            'purchase_date' => Carbon::create(2026, 3, 20, 10, 0, 0),
            'total_amount' => 999000,
            'currency' => 'VND',
            'status' => 'processing',
            'ocr_text' => 'sample ocr text',
            'extracted_data' => ['store_name' => 'Store C'],
            'confidence_score' => 40.0,
        ]);

        Bill::create([
            'user_id' => $user->id,
            'file_url' => 'storage/bills/april.jpg',
            'store_name' => 'Store D',
            'purchase_date' => Carbon::create(2026, 4, 2, 10, 0, 0),
            'total_amount' => 500000,
            'currency' => 'VND',
            'status' => 'done',
            'ocr_text' => 'sample ocr text',
            'extracted_data' => ['store_name' => 'Store D'],
            'confidence_score' => 88.0,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/messages/send', [
            'content' => 'Thong ke tong tien hoa don thang 3 2026 bao nhieu?',
        ]);

        $response->assertOk();
        $response->assertJsonPath('user_message.content', 'Thong ke tong tien hoa don thang 3 2026 bao nhieu?');
        $response->assertJsonPath('bot_message.content', 'Thang 03/2026 co 2 hoa don, tong tien la 350.000 VND.');

        $this->assertSame(2, Message::count());
        $this->assertSame(4, Bill::count());
    }
}
