<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ConversationAndPasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_updates_conversation_status_and_title(): void
    {
        $user = User::factory()->create();
        $conversation = Conversation::create([
            'user_id' => $user->id,
            'title' => 'Initial title',
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'content' => 'Hello world',
            'role' => 'user',
            'type' => 'text',
        ]);

        Sanctum::actingAs($user);

        $response = $this->patchJson("/api/conversations/{$conversation->id}", [
            'title' => 'Updated title',
            'is_pinned' => true,
            'is_archived' => true,
        ]);

        $response->assertOk();
        $response->assertJsonPath('conversation.title', 'Updated title');
        $response->assertJsonPath('conversation.is_pinned', true);
        $response->assertJsonPath('conversation.is_archived', true);
        $response->assertJsonPath('conversation.message_count', 1);

        $this->assertDatabaseHas('conversations', [
            'id' => $conversation->id,
            'title' => 'Updated title',
            'is_pinned' => 1,
            'is_archived' => 1,
        ]);
    }

    public function test_it_sends_and_processes_password_reset_requests(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'password' => Hash::make('old-password'),
        ]);

        $requestResponse = $this->postJson('/api/forgot-password', [
            'email' => $user->email,
        ]);

        $requestResponse->assertOk();

        Notification::assertSentTo($user, ResetPassword::class);

        $token = Password::broker()->createToken($user);

        $resetResponse = $this->postJson('/api/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $resetResponse->assertOk();
        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }
}
