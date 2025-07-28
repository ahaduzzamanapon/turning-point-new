<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ]
        );

        $role = Role::firstOrCreate(['name' => 'admin']);

        // Get all existing permissions
        $allPermissions = Permission::pluck('name')->toArray();

        // Add base permissions if they don't exist
        $basePermissions = [
            'crud-builder-access',
            'manage-users',
            'manage-roles',
            'manage-permissions',
            'manage-settings',
            'manage-students',
            'manage-batches',
            'manage-courses',
            'representatives_view',
            'representatives_delete',
            'representatives_edit',
            'representatives_create',
            'representatives_view',
            'paymentmethods_view',
            'paymentmethods_delete',
            'paymentmethods_edit',
            'paymentmethods_create',
        ];

        foreach ($basePermissions as $permission) {
            if (!in_array($permission, $allPermissions)) {
                Permission::firstOrCreate(['name' => $permission]);
                $allPermissions[] = $permission;
            }
        }

        $role->syncPermissions($allPermissions);

        $user->assignRole($role);
    }
}