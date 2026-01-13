<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::updateOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Admin',
                'description' => 'Administrateur avec tous les droits',
                'is_active' => true,
            ]
        );

        Role::updateOrCreate(
            ['slug' => 'client'],
            [
                'name' => 'Client',
                'description' => 'Client standard de l\'application',
                'is_active' => true,
            ]
        );
    }
}
