<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('file_url');
            $table->string('store_name')->nullable();
            $table->dateTime('purchase_date')->nullable();

            $table->decimal('total_amount', 12, 2)->nullable();
            $table->string('currency')->default('VND');

            $table->string('status')->default('processing'); // processing | done | failed

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
