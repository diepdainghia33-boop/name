<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->string('invoice_number')->nullable()->after('store_name');
            $table->longText('ocr_text')->nullable()->after('file_url');
            $table->json('extracted_data')->nullable()->after('ocr_text');
            $table->decimal('confidence_score', 5, 2)->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->dropColumn(['invoice_number', 'ocr_text', 'extracted_data', 'confidence_score']);
        });
    }
};
