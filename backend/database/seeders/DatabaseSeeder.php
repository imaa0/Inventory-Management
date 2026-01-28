<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create a default user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@inventory.com',
            'password' => Hash::make('password'),
        ]);
    }
}
