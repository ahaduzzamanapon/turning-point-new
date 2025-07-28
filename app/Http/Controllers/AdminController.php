<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student; // Added for dynamic data
use App\Models\Course; // Added for dynamic data
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\UserRequest;
use App\Http\Requests\RoleRequest;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Index');
    }

    // New method to fetch dashboard data
    public function dashboardData()
    {
        // Fetch dynamic data
        $totalStudents = Student::count();
        $totalCourses = Course::count();
        // For demonstration, using dummy data for revenue and new registrations
        // In a real application, you would fetch this from your database
        $monthlyRevenue = 25000; // Example
        $newRegistrations = 150; // Example

        // Data for charts (example - you'd fetch this dynamically)
        $salesData = [65, 59, 80, 81, 56, 55, 40]; // Monthly sales
        $enrollmentData = [300, 250, 180, 220]; // Course enrollments

        return Inertia::render('Dashboard', [
            'totalStudents' => $totalStudents,
            'totalCourses' => $totalCourses,
            'monthlyRevenue' => $monthlyRevenue,
            'newRegistrations' => $newRegistrations,
            'salesData' => $salesData,
            'enrollmentData' => $enrollmentData,
        ]);
    }

    public function users()
    {
        $users = User::with('roles', 'permissions')->get();
        $roles = Role::all();
        return Inertia::render('Admin/Users/Index', ['users' => $users, 'roles' => $roles]);
    }

    public function createUser()
    {
        $roles = Role::all();
        return Inertia::render('Admin/Users/Create', ['roles' => $roles]);
    }

    public function storeUser(UserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->syncRoles($request->roles);

        return redirect()->route('admin.users')->with('success', 'User created successfully.');
    }

    public function editUser(User $user)
    {
        $user->load('roles');
        $roles = Role::all();
        return Inertia::render('Admin/Users/Edit', ['user' => $user, 'roles' => $roles]);
    }

    public function updateUser(UserRequest $request, User $user)
    {
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->password) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        $user->syncRoles($request->roles);

        return redirect()->route('admin.users')->with('success', 'User updated successfully.');
    }

    public function destroyUser(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users')->with('success', 'User deleted successfully.');
    }

    public function roles()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();
        return Inertia::render('Admin/Roles/Index', ['roles' => $roles, 'permissions' => $permissions]);
    }

    public function permissions()
    {
        $permissions = Permission::all();
        return Inertia::render('Admin/Permissions/Index', ['permissions' => $permissions]);
    }

    public function assignRole(Request $request)
    {
        $user = User::findOrFail((int)$request->userId);
        $role = Role::findOrFail((int)$request->roleId);
        $user->assignRole($role);
        return back();
    }

    public function removeRole(Request $request)
    {
        $user = User::findOrFail((int)$request->userId);
        $role = Role::findOrFail((int)$request->roleId);
        $user->removeRole($role);
        return back();
    }

    public function givePermission(Request $request)
    {
        $role = Role::findOrFail((int)$request->roleId);
        $permission = Permission::findOrFail((int)$request->permissionId);
        $role->givePermissionTo($permission);
        return back();
    }

    public function revokePermission(Request $request)
    {
        $role = Role::findOrFail((int)$request->roleId);
        $permission = Permission::findOrFail((int)$request->permissionId);
        $role->revokePermissionTo($permission);
        return back();
    }

    public function syncPermissions(Request $request)
    {
        $request->validate([
            'roleId' => 'required|integer|exists:roles,id',
            'permissions' => 'array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $role = Role::findOrFail($request->roleId);
        $permissions = Permission::whereIn('id', $request->permissions)->get();
        $role->syncPermissions($permissions);

        return back()->with('success', 'Permissions updated successfully.');
    }

    public function createRole()
    {
        return Inertia::render('Admin/Roles/Create');
    }

    public function storeRole(RoleRequest $request)
    {
        Role::create(['name' => $request->name]);
        return redirect()->route('admin.roles')->with('success', 'Role created successfully.');
    }

    public function editRole(Role $role)
    {
        return Inertia::render('Admin/Roles/Edit', ['role' => $role]);
    }

    public function updateRole(RoleRequest $request, Role $role)
    {
        $role->update(['name' => $request->name]);
        return redirect()->route('admin.roles')->with('success', 'Role updated successfully.');
    }

    public function destroyRole(Role $role)
    {
        $role->delete();
        return redirect()->route('admin.roles')->with('success', 'Role deleted successfully.');
    }
}