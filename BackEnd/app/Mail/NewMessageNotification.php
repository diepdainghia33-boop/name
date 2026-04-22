<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewMessageNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $botMessage;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $botMessage)
    {
        $this->user = $user;
        $this->botMessage = $botMessage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Bạn có tin nhắn mới từ Architect AI',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.messages.new',
            with: [
                'user' => $this->user,
                'botMessage' => $this->botMessage,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
