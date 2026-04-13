<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 👤 USER
        DB::table('users')->insert([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => Hash::make('123456'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 🏷️ CATEGORY
        DB::table('categories')->insert([
            ['name' => 'Food'],
            ['name' => 'Drink'],
            ['name' => 'Shopping'],
        ]);

        // 💬 CONVERSATION
        DB::table('conversations')->insert([
            'user_id' => 1,
            'title' => 'Chat phân tích hóa đơn',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 🗨️ MESSAGE
        DB::table('messages')->insert([
            [
                'conversation_id' => 1,
                'content' => 'Đây là hóa đơn của tôi',
                'role' => 'user',
                'type' => 'text',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'conversation_id' => 1,
                'content' => 'Tôi đã phân tích xong hóa đơn',
                'role' => 'bot',
                'type' => 'text',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 🧾 BILL
        DB::table('bills')->insert([
            'user_id' => 1,
            'file_url' => 'uploads/sample.jpg',
            'store_name' => 'Circle K',
            'purchase_date' => now(),
            'total_amount' => 50000,
            'currency' => 'VND',
            'status' => 'done',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 🛒 BILL ITEMS
        DB::table('bill_items')->insert([
            [
                'bill_id' => 1,
                'name' => 'Mì gói',
                'quantity' => 2,
                'price' => 10000,
                'total' => 20000,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'bill_id' => 1,
                'name' => 'Coca Cola',
                'quantity' => 1,
                'price' => 30000,
                'total' => 30000,
                'category_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
