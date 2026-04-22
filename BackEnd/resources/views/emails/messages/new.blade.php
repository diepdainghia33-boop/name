<x-mail::message>
# Bạn có tin nhắn mới từ Architect AI

Chào {{ $user->name }},

Bạn vừa nhận được một phản hồi mới từ **Architect AI**:

<x-mail::panel>
{{ $botMessage->content }}
</x-mail::panel>

<x-mail::button :url="config('app.url') . '/chat'">
Xem cuộc trò chuyện
</x-mail::button>

Trân trọng,<br>
Đội ngũ {{ config('app.name') }}
</x-mail::message>
