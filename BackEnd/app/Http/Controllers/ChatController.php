<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\BillItem;
use App\Models\Conversation;
use App\Models\Message;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\NewMessageNotification;

class ChatController extends Controller
{
    /** AI service base URL */
    private string $aiServiceUrl;

    public function __construct()
    {
        $this->aiServiceUrl = config('services.ai.url', 'http://127.0.0.1:8001');
    }

    public function getConversations()
    {
        $conversations = Conversation::where('user_id', Auth::id())
            ->withCount('messages')
            ->withSum('messages', 'tokens')
            ->with('latestMessage')
            ->orderBy('is_archived')
            ->orderByDesc('is_pinned')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Conversation $conversation) => $this->formatConversation($conversation))
            ->values();

        return response()->json($conversations);
    }

    public function getMessages($id)
    {
        $conversation = Conversation::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $messages = Message::with('bill.items')->where('conversation_id', $conversation->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'content'         => 'nullable|string|max:10000',
            'conversation_id' => 'nullable|integer',
            'image'           => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'file'            => 'nullable|file|mimes:pdf,xlsx,xls,csv|max:10240',
            'search_mode'     => 'nullable|boolean',
            'model'           => 'nullable|string',
            'context_length'  => 'nullable|integer',
            'precision'       => 'nullable|integer',
        ]);

        $userId         = Auth::id();
        $conversationId = $request->conversation_id;
        $searchMode     = $request->boolean('search_mode');
        $requestedModel = $request->input('model');
        $contextLength  = $request->input('context_length', 4000);
        $precision      = $request->input('precision', 80);

        // Map 1-100 precision to 1.0-0.0 temperature
        $temperature = (101 - $precision) / 100;

        // ── Resolve or create conversation ────────────────────────────────────
        if ($conversationId) {
            $conversation = Conversation::where('id', $conversationId)
                ->where('user_id', $userId)
                ->firstOrFail();
        } else {
            $rawTitle = $request->input('content', 'New Chat');
            $title    = strlen($rawTitle) > 50
                ? mb_substr($rawTitle, 0, 47) . '...'
                : ($rawTitle ?: 'New Image Chat');

            $conversation   = Conversation::create(['user_id' => $userId, 'title' => $title]);
            $conversationId = $conversation->id;
        }

        // ── Handle image upload ────────────────────────────────────────────────
        // Handle natural-language invoice stats directly from the database.
        $rawContent = trim((string) $request->input('content', ''));
        if (
            !$request->hasFile('image')
            && !$request->hasFile('file')
            && $this->isInvoiceMonthlyStatsQuery($rawContent)
        ) {
            $userMessage = Message::create([
                'conversation_id' => $conversationId,
                'content'         => $rawContent,
                'role'            => 'user',
                'type'            => 'text',
                'search_mode'     => $searchMode,
            ]);

            $botText = $this->buildInvoiceMonthlyStatsResponse($userId, $rawContent);

            $botMessage = Message::create([
                'conversation_id'  => $conversationId,
                'content'          => $botText,
                'role'             => 'bot',
                'type'             => 'text',
                'tokens'           => 0,
                'response_time_ms' => null,
            ]);

            return response()->json([
                'conversation_id' => $conversationId,
                'user_message'    => $userMessage,
                'bot_message'     => $botMessage,
            ]);
        }

        $imagePath = null;
        $imageData  = null;
        $imageType  = null;
        $type      = 'text';
        $ocrData   = null;
        $bill      = null;

        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $path      = $imageFile->store('chat_images', 'public');
            $imagePath = asset('storage/' . $path);
            $imageData  = base64_encode(file_get_contents($imageFile->getRealPath()));
            $imageType  = strtolower($imageFile->getClientOriginalExtension() ?: 'jpg');
            $type      = 'bill';

            try {
                $ocrResponse = Http::timeout(90)->post("{$this->aiServiceUrl}/api/invoices/ocr", [
                    'image_base64' => $imageData,
                    'image_type'   => $imageType,
                    'filename'     => $imageFile->getClientOriginalName(),
                ]);

                if ($ocrResponse->successful()) {
                    $ocrData = $ocrResponse->json();
                } else {
                    Log::warning('Invoice OCR returned non-2xx', [
                        'status' => $ocrResponse->status(),
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('Invoice OCR unreachable: ' . $e->getMessage());
            }

            $billData = $ocrData['bill'] ?? [];
            $extractedData = $ocrData['extracted'] ?? null;
            $confidence = data_get($billData, 'confidence_score');
            $billStatus = !empty($ocrData) ? 'done' : 'processing';

            $bill = Bill::create([
                'user_id' => $userId,
                'file_url' => $imagePath,
                'invoice_number' => data_get($billData, 'invoice_number'),
                'store_name' => data_get($billData, 'store_name'),
                'purchase_date' => data_get($billData, 'purchase_date'),
                'total_amount' => data_get($billData, 'total_amount'),
                'currency' => data_get($billData, 'currency', 'VND'),
                'status' => $billStatus,
                'ocr_text' => $ocrData['raw_text'] ?? null,
                'extracted_data' => $extractedData,
                'confidence_score' => $confidence,
            ]);

            $items = data_get($billData, 'items', []);
            if (is_array($items)) {
                foreach ($items as $item) {
                    $name = data_get($item, 'name');
                    if (!$name) {
                        continue;
                    }

                    BillItem::create([
                        'bill_id' => $bill->id,
                        'name' => $name,
                        'quantity' => max(1, (int) (data_get($item, 'quantity', 1) ?: 1)),
                        'price' => data_get($item, 'price', 0) ?: 0,
                        'total' => data_get($item, 'total'),
                    ]);
                }
            }
        }

        // ── Handle document upload (PDF/Excel) ─────────────────────────────────
        $fileData = null;
        $fileType = null;
        $filePath = null;

        if ($request->hasFile('file')) {
            $file      = $request->file('file');
            $fileData  = base64_encode(file_get_contents($file->getRealPath()));
            $fileType  = strtolower($file->getClientOriginalExtension());
            $path      = $file->store('chat_files', 'public');
            $filePath  = asset('storage/' . $path);
            $type      = 'document';

            // Create notification for file analysis
            \App\Models\Notification::create([
                'user_id' => $userId,
                'title' => 'Document Received',
                'message' => 'The system is analyzing your ' . strtoupper($fileType) . ' document.',
                'type' => 'info',
                'icon' => 'description',
                'is_read' => false
            ]);
        }

        // ── Save user message ──────────────────────────────────────────────────
        $userMessage = Message::create([
            'conversation_id' => $conversationId,
            'content'         => $request->input('content'),
            'role'            => 'user',
            'type'            => $type,
            'bill_id'         => $bill?->id,
            'image_path'      => $imagePath,
            'file_path'       => $filePath,
            'file_type'       => $fileType,
            'search_mode'     => $searchMode,
        ]);

        if ($bill) {
            $userMessage->load('bill.items');
        }

        // ── Build conversation history for AI ──────────────────────────────────
        $history = Message::where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn ($m) => [
                'role'    => $m->role,
                'content' => $m->content ?? '',
            ])
            ->toArray();

        // ── Prepare files array for AI v2 ─────────────────────────────────────
        $files = [];
        if ($imageData && $imageType) {
            $files[] = [
                'type' => $imageType,
                'data' => $imageData,
            ];
        }
        if ($fileData && $fileType) {
            $files[] = [
                'type' => $fileType,
                'data' => $fileData,
            ];
        }

        // ── Determine which AI endpoint to call ───────────────────────────────
        $useV2 = !empty($files) || $searchMode;

        // ── Call AI service ────────────────────────────────────────────────────
        $aiText    = null;
        $aiTokens  = 0;
        $aiModel   = $requestedModel ?? 'llama-3.3-70b-versatile';
        $responseTimeMs = null;
        $aiRequestStartedAt = microtime(true);

        try {
            if ($useV2) {
                // Use Claude-powered v2 endpoint
                $aiResponse = Http::timeout(60)->post("{$this->aiServiceUrl}/api/chat/v2", [
                    'history'        => $history,
                    'files'          => $files,
                    'search_enabled' => $searchMode,
                    'model'          => $requestedModel,
                    'max_tokens'     => $contextLength,
                    'temperature'    => $temperature,
                ]);
                $aiModel = $requestedModel ?? 'claude-3-5-sonnet-20241022';
            } else {
                // Use original Groq endpoint
                $aiResponse = Http::timeout(30)->post("{$this->aiServiceUrl}/api/chat", [
                    'history'     => $history,
                    'model'       => $requestedModel,
                    'max_tokens'  => $contextLength,
                    'temperature' => $temperature,
                ]);
            }

            if ($aiResponse->successful()) {
                $aiData   = $aiResponse->json();
                $aiText   = $aiData['content']  ?? null;
                $aiTokens = $aiData['tokens']   ?? 0;
                $aiModel  = $aiData['model']    ?? $aiModel;
            } else {
                Log::warning('AI service returned non-2xx', ['status' => $aiResponse->status()]);
            }
        } catch (\Exception $e) {
            Log::error('AI service unreachable: ' . $e->getMessage());
        } finally {
            $responseTimeMs = (int) max(1, round((microtime(true) - $aiRequestStartedAt) * 1000));
        }

        // Fallback if AI service is down
        if (!$aiText) {
            if ($fileData) {
                $aiText = "Tôi đã nhận được file của bạn. Xin lỗi, dịch vụ AI đang bận — hãy thử lại sau.";
            } elseif ($searchMode) {
                $aiText = "Xin lỗi, dịch vụ tìm kiếm web đang tạm thời không khả dụng. Hãy thử lại sau.";
            } elseif ($imagePath) {
                $aiText = "Tôi đã nhận được hình ảnh của bạn. Xin lỗi, dịch vụ AI đang bận — hãy thử lại sau.";
            } else {
                $aiText = "Xin lỗi, dịch vụ AI đang tạm thời không khả dụng. Hãy đảm bảo server AI (port 8001) đang chạy.";
            }
        }

        // ── Save bot message ───────────────────────────────────────────────────
        $botMessage = Message::create([
            'conversation_id' => $conversationId,
            'content'         => $aiText,
            'role'            => 'bot',
            'type'            => 'text',
            'tokens'          => $aiTokens,
            'response_time_ms' => $responseTimeMs,
        ]);

        // ── Send Email Notification if enabled ─────────────────────────────────
        try {
            $user = Auth::user();
            $prefs = $user->preferences;
            if (isset($prefs['toggles']['emailNotifications']) && $prefs['toggles']['emailNotifications']) {
                Mail::to($user->email)->send(new NewMessageNotification($user, $botMessage));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send email notification: ' . $e->getMessage());
        }

        return response()->json([
            'conversation_id' => $conversationId,
            'user_message'    => $userMessage,
            'bot_message'     => $botMessage,
        ]);
    }

    private function isInvoiceMonthlyStatsQuery(string $content): bool
    {
        $text = $this->normalizeQueryText($content);

        if ($text === '') {
            return false;
        }

        $invoiceKeywords = ['hoa don', 'invoice', 'bill', 'receipt'];
        $statsKeywords = ['thong ke', 'tong tien', 'bao nhieu', 'so tien'];
        $monthKeywords = ['thang', 'this month', 'last month', 'thang nay', 'thang truoc'];

        return $this->containsAny($text, $invoiceKeywords)
            && ($this->containsAny($text, $statsKeywords) || $this->containsAny($text, $monthKeywords));
    }

    private function buildInvoiceMonthlyStatsResponse(int $userId, string $content): string
    {
        [$start, $end, $label] = $this->resolveInvoiceStatsRange($content);
        $query = $this->invoiceStatsQuery($userId, $start, $end);

        $totalBills = (clone $query)->count();
        $currencyRows = (clone $query)
            ->selectRaw("COALESCE(currency, 'VND') as currency, COUNT(*) as bill_count, COALESCE(SUM(total_amount), 0) as total_amount")
            ->groupByRaw("COALESCE(currency, 'VND')")
            ->orderBy('currency')
            ->get();

        if ($totalBills === 0 || $currencyRows->isEmpty()) {
            return "Thang {$label} ban chua co hoa don da luu trong he thong.";
        }

        if ($currencyRows->count() === 1) {
            $row = $currencyRows->first();

            return sprintf(
                'Thang %s co %d hoa don, tong tien la %s %s.',
                $label,
                $totalBills,
                $this->formatMoney($row->total_amount),
                $row->currency ?? 'VND'
            );
        }

        $breakdown = $currencyRows
            ->map(function ($row) {
                $currency = $row->currency ?? 'VND';

                return sprintf(
                    '- %s: %s (%d hoa don)',
                    $currency,
                    $this->formatMoney($row->total_amount),
                    (int) $row->bill_count
                );
            })
            ->implode("\n");

        return "Thang {$label} co {$totalBills} hoa don. Tong tien duoc tach theo tung tien te:\n{$breakdown}";
    }

    private function invoiceStatsQuery(int $userId, Carbon $start, Carbon $end)
    {
        return Bill::query()
            ->where('user_id', $userId)
            ->where('status', 'done')
            ->whereNotNull('total_amount')
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('purchase_date', [$start, $end])
                    ->orWhere(function ($query) use ($start, $end) {
                        $query->whereNull('purchase_date')
                            ->whereBetween('created_at', [$start, $end]);
                    });
            });
    }

    private function resolveInvoiceStatsRange(string $content): array
    {
        $text = $this->normalizeQueryText($content);
        $now = Carbon::now();

        if (str_contains($text, 'thang truoc') || str_contains($text, 'last month')) {
            $period = $now->copy()->subMonthNoOverflow()->startOfMonth();

            return [$period->copy()->startOfMonth(), $period->copy()->endOfMonth(), $period->format('m/Y')];
        }

        if (
            str_contains($text, 'thang nay')
            || str_contains($text, 'this month')
            || str_contains($text, 'current month')
        ) {
            $period = $now->copy()->startOfMonth();

            return [$period->copy()->startOfMonth(), $period->copy()->endOfMonth(), $period->format('m/Y')];
        }

        $month = (int) $now->month;
        $year = (int) $now->year;

        if (preg_match('/\bthang\s+(\d{1,2})(?:\s*(?:\/|-|\s+nam\s+|\s)\s*(\d{4}))?\b/u', $text, $matches)) {
            $month = max(1, min(12, (int) $matches[1]));

            if (!empty($matches[2])) {
                $year = (int) $matches[2];
            }
        } elseif (
            preg_match('/\b(?:nam|year)\s*(\d{4})\b/u', $text, $matchesYear)
            && preg_match('/\bthang\s+(\d{1,2})\b/u', $text, $matchesMonth)
        ) {
            $month = max(1, min(12, (int) $matchesMonth[1]));
            $year = (int) $matchesYear[1];
        }

        $start = Carbon::create($year, $month, 1)->startOfMonth();
        $end = $start->copy()->endOfMonth();

        return [$start, $end, $start->format('m/Y')];
    }

    private function normalizeQueryText(?string $content): string
    {
        return Str::of((string) $content)->lower()->ascii()->squish()->toString();
    }

    private function containsAny(string $text, array $needles): bool
    {
        foreach ($needles as $needle) {
            if ($needle !== '' && str_contains($text, $needle)) {
                return true;
            }
        }

        return false;
    }

    private function formatMoney($amount): string
    {
        if ($amount === null || $amount === '') {
            return '0';
        }

        $formatted = number_format((float) $amount, 2, ',', '.');

        return preg_replace('/,00$/', '', $formatted) ?? $formatted;
    }

    public function submitFeedback(Request $request, $id)
    {
        $request->validate([
            'feedback' => 'required|integer|in:1,-1,0',
        ]);

        $message = Message::where('id', $id)->firstOrFail();
        
        // Ensure message belongs to user
        $conversation = Conversation::where('id', $message->conversation_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $message->update(['feedback' => $request->feedback]);

        return response()->json(['message' => 'Feedback submitted successfully']);
    }

    public function deleteConversation($id)
    {
        $conversation = Conversation::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $conversation->delete();

        return response()->json(['message' => 'Conversation deleted successfully']);
    }

    public function updateConversation(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'is_pinned' => 'sometimes|boolean',
            'is_archived' => 'sometimes|boolean',
        ]);

        $conversation = Conversation::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $data = [];

        if ($request->has('title')) {
            $data['title'] = trim((string) $request->input('title'));
        }

        if ($request->has('is_pinned')) {
            $data['is_pinned'] = $request->boolean('is_pinned');
        }

        if ($request->has('is_archived')) {
            $data['is_archived'] = $request->boolean('is_archived');
        }

        $conversation->update($data);
        $conversation->loadCount('messages');
        $conversation->loadSum('messages', 'tokens');
        $conversation->load('latestMessage');

        return response()->json([
            'message' => 'Conversation updated successfully',
            'conversation' => $this->formatConversation($conversation),
        ]);
    }

    private function formatConversation(Conversation $conversation): array
    {
        $latestMessage = $conversation->latestMessage;
        $preview = null;

        if ($latestMessage?->content) {
            $preview = Str::limit((string) $latestMessage->content, 120);
        }

        return [
            'id' => $conversation->id,
            'user_id' => $conversation->user_id,
            'title' => $conversation->title,
            'is_pinned' => (bool) $conversation->is_pinned,
            'is_archived' => (bool) $conversation->is_archived,
            'message_count' => (int) ($conversation->messages_count ?? 0),
            'token_count' => (int) ($conversation->messages_sum_tokens ?? 0),
            'preview' => $preview,
            'created_at' => $conversation->created_at,
            'updated_at' => $conversation->updated_at,
            'latest_message_at' => $latestMessage?->created_at,
        ];
    }
}
