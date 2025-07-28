<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Representative;
use App\Models\Batch;
use App\Models\PaymentMethod;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Http\Controllers\AdminController;

Route::get('/dashboard', [AdminController::class, 'dashboardData'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/crud-builder', [App\Http\Controllers\CrudBuilderController::class, 'index'])->name('crud.builder');
    Route::post('/crud-builder', [App\Http\Controllers\CrudBuilderController::class, 'generate'])->name('crud.generate');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [App\Http\Controllers\AdminController::class, 'index'])->name('index');
        Route::get('/users', [App\Http\Controllers\AdminController::class, 'users'])->name('users');
        Route::get('/roles', [App\Http\Controllers\AdminController::class, 'roles'])->name('roles');
        Route::get('/permissions', [App\Http\Controllers\AdminController::class, 'permissions'])->name('permissions');
        Route::post('/users/assign-role', [App\Http\Controllers\AdminController::class, 'assignRole'])->name('users.assignRole');
        Route::post('/users/remove-role', [App\Http\Controllers\AdminController::class, 'removeRole'])->name('users.removeRole');
        Route::get('/users/create', [App\Http\Controllers\AdminController::class, 'createUser'])->name('users.create');
        Route::post('/users', [App\Http\Controllers\AdminController::class, 'storeUser'])->name('users.store');
        Route::get('/users/{user}/edit', [App\Http\Controllers\AdminController::class, 'editUser'])->name('users.edit');
        Route::put('/users/{user}', [App\Http\Controllers\AdminController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [App\Http\Controllers\AdminController::class, 'destroyUser'])->name('users.destroy');
        Route::post('/roles/give-permission', [App\Http\Controllers\AdminController::class, 'givePermission'])->name('roles.givePermission');
        Route::post('/roles/revoke-permission', [App\Http\Controllers\AdminController::class, 'revokePermission'])->name('roles.revokePermission');
        Route::post('/roles/sync-permissions', [App\Http\Controllers\AdminController::class, 'syncPermissions'])->name('roles.syncPermissions');
        Route::get('/roles/create', [App\Http\Controllers\AdminController::class, 'createRole'])->name('roles.create');
        Route::post('/roles', [App\Http\Controllers\AdminController::class, 'storeRole'])->name('roles.store');
        Route::get('/roles/{role}/edit', [App\Http\Controllers\AdminController::class, 'editRole'])->name('roles.edit');
        Route::put('/roles/{role}', [App\Http\Controllers\AdminController::class, 'updateRole'])->name('roles.update');
        Route::delete('/roles/{role}', [App\Http\Controllers\AdminController::class, 'destroyRole'])->name('roles.destroy');

        Route::get('/settings', [App\Http\Controllers\SettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [App\Http\Controllers\SettingController::class, 'update'])->name('settings.update');

        Route::resource('/students', App\Http\Controllers\StudentController::class);
        Route::post('/students/{student}/toggle-active', [App\Http\Controllers\StudentController::class, 'toggleActiveStatus'])->name('students.toggleActiveStatus');
        Route::post('/students/bulk-update-status', [App\Http\Controllers\StudentController::class, 'bulkUpdateStatus'])->name('students.bulkUpdateStatus');
        Route::post('/students/{student}/verify-payment', [App\Http\Controllers\StudentController::class, 'verifyPayment'])->name('students.verifyPayment');
        Route::post('/students/{student}/reject-payment', [App\Http\Controllers\StudentController::class, 'rejectPayment'])->name('students.rejectPayment');
        Route::post('/students/{student}/mark-registration-complete', [App\Http\Controllers\StudentController::class, 'markRegistrationComplete'])->name('students.markRegistrationComplete');
        Route::post('/students/bulk-mark-registration-complete', [App\Http\Controllers\StudentController::class, 'bulkMarkRegistrationComplete'])->name('students.bulkMarkRegistrationComplete');
        Route::resource('/courses', App\Http\Controllers\CourseController::class);
        Route::resource('/batches', App\Http\Controllers\BatchController::class);

    });
});

require __DIR__ . '/auth.php';

Route::post('/register-student', [App\Http\Controllers\StudentController::class, 'store'])->name('student.register');

Route::get('/registration', function () {
    return Inertia::render('Registration');
})->name('registration');


 Route::prefix('api')->group(function () {
        
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
    
        Route::get('/courses', function () {
            return Course::all();
        });
    
        Route::get('/representatives', function () {
            return Representative::all();
        });
    
        Route::get('/batches', function () {
            return [];
        });
    
        Route::get('/payment-methods', function () {
            return PaymentMethod::all();
        });
        Route::get('/courses/{course}/batches', function (App\Models\Course $course) {
           
            return $course->batches;
        });
    });



Route::middleware(['auth'])->group(function () {
    Route::resource('courses', \App\Http\Controllers\CourseController::class);

   
});

Route::middleware(['auth'])->group(function () {
    Route::resource('paymentmethods', \App\Http\Controllers\PaymentMethodController::class);
});

Route::middleware(['auth'])->group(function () {
    Route::resource('representatives', \App\Http\Controllers\RepresentativeController::class);
});
