<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@owens.com'], [
            'name' => 'N. Admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
        User::updateOrCreate(['email' => 'cajero@owens.com'], [
            'name' => 'N. Cajero',
            'password' => Hash::make('password'),
            'role' => 'cajero',
        ]);
        User::updateOrCreate(['email' => 'cocinero@owens.com'], [
            'name' => 'N. Cocinero',
            'password' => Hash::make('password'),
            'role' => 'cocinero',
        ]);
    }
}
