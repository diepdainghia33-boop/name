<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Blueprint;
use App\Models\ActivityLog;
use Illuminate\Database\Seeder;

class DashboardSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // Seed Blueprints
            Blueprint::create([
                'user_id' => $user->id,
                'title' => 'Neural Arch V2',
                'description' => 'Advanced neural structural analysis.',
                'type' => 'info'
            ]);
            Blueprint::create([
                'user_id' => $user->id,
                'title' => 'Skyline Simulation',
                'description' => 'Urban density modeling v4.',
                'type' => 'info'
            ]);
            Blueprint::create([
                'user_id' => $user->id,
                'title' => 'Quantum Core',
                'description' => 'Stabilizing material lattice.',
                'type' => 'success'
            ]);

            // Seed Activity Logs
            ActivityLog::create([
                'user_id' => $user->id,
                'message' => 'System handshake complete',
                'type' => 'success'
            ]);
            ActivityLog::create([
                'user_id' => $user->id,
                'message' => 'Matrix layer detected',
                'type' => 'info'
            ]);
        }
    }
}
