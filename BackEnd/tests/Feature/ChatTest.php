<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * Test gửi tin nhắn văn bản và nhận phản hồi từ AI (Mocked).
     */
    public function test_send_text_message_successfully()
    {
        // Giả lập phản hồi từ AI Service
        Http::fake([
            '*/api/chat' => Http::response([
                'content' => 'Chào bạn, tôi là AI của Architect.',
                'tokens' => 15,
                'model' => 'llama-3.3-70b-versatile'
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/messages/send', [
                'content' => 'Hello AI',
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'conversation_id',
                'user_message',
                'bot_message'
            ])
            ->assertJsonPath('bot_message.content', 'Chào bạn, tôi là AI của Architect.');

        $this->assertDatabaseHas('messages', [
            'content' => 'Hello AI',
            'role' => 'user'
        ]);
    }

    /**
     * Test xóa hội thoại.
     */
    public function test_delete_conversation()
    {
        $conversation = Conversation::create([
            'user_id' => $this->user->id,
            'title' => 'Test Conversation'
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/conversations/{$conversation->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('conversations', ['id' => $conversation->id]);
    }

    /**
     * Test nhân bản hội thoại.
     */
    public function test_duplicate_conversation()
    {
        $conversation = Conversation::create([
            'user_id' => $this->user->id,
            'title' => 'Original Chat'
        ]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/conversations/{$conversation->id}/duplicate");

        $response->assertStatus(200)
            ->assertJsonPath('conversation.title', 'Original Chat (Copy)');

        $this->assertEquals(2, Conversation::count());
    }
}
