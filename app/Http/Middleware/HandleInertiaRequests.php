<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $crudModules = [];
        $modelsPath = app_path('Models');
        $modelFiles = File::files($modelsPath);

        foreach ($modelFiles as $file) {
            $modelName = pathinfo($file->getFilename(), PATHINFO_FILENAME);
            // Exclude default Laravel models or any other models you don't want in the CRUD menu
            if (!in_array($modelName, ['User'])) {
                $crudModules[] = [
                    'name' => Str::plural($modelName),
                    'routePrefix' => Str::lower(Str::plural($modelName)),
                ];
            }
        }

        $rolePermissions = [];
        if ($request->user()) {
            $roles =  \Spatie\Permission\Models\Role::with('permissions')->get();
            foreach ($roles as $role) {
                if ($request->user()->hasRole($role->name)) {
                    $rolePermissions = array_merge($rolePermissions, $role->permissions->pluck('name')->toArray());
                }
            }
        }

        $settings = Setting::all()->pluck('value', 'key')->toArray();
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $rolePermissions,
                ] : null,
            ],
            'settings' => $settings,
        ];
    }
}

