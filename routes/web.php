<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Representative;
use App\Models\Batch;
use App\Models\PaymentMethod;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StudentAttendanceReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\BatchController;
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



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
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::get('/roles', [AdminController::class, 'roles'])->name('roles');
        Route::get('/permissions', [AdminController::class, 'permissions'])->name('permissions');
        Route::post('/users/assign-role', [AdminController::class, 'assignRole'])->name('users.assignRole');
        Route::post('/users/remove-role', [AdminController::class, 'removeRole'])->name('users.removeRole');
        Route::get('/users/create', [AdminController::class, 'createUser'])->name('users.create');
        Route::post('/users', [AdminController::class, 'storeUser'])->name('users.store');
        Route::get('/users/{user}/edit', [AdminController::class, 'editUser'])->name('users.edit');
        Route::put('/users/{user}', [AdminController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])->name('users.destroy');
        Route::post('/roles/give-permission', [AdminController::class, 'givePermission'])->name('roles.givePermission');
        Route::post('/roles/revoke-permission', [AdminController::class, 'revokePermission'])->name('roles.revokePermission');
        Route::post('/roles/sync-permissions', [AdminController::class, 'syncPermissions'])->name('roles.syncPermissions');
        Route::get('/roles/create', [AdminController::class, 'createRole'])->name('roles.create');
        Route::post('/roles', [AdminController::class, 'storeRole'])->name('roles.store');
        Route::get('/roles/{role}/edit', [AdminController::class, 'editRole'])->name('roles.edit');
        Route::put('/roles/{role}', [AdminController::class, 'updateRole'])->name('roles.update');
        Route::delete('/roles/{role}', [AdminController::class, 'destroyRole'])->name('roles.destroy');

        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');

        Route::resource('/students', StudentController::class);
        Route::post('/students/{student}/toggle-active', [StudentController::class, 'toggleActiveStatus'])->name('students.toggleActiveStatus');
        Route::post('/students/bulk-update-status', [StudentController::class, 'bulkUpdateStatus'])->name('students.bulkUpdateStatus');
        Route::post('/students/{student}/verify-payment', [StudentController::class, 'verifyPayment'])->name('students.verifyPayment');
        Route::post('/students/{student}/reject-payment', [StudentController::class, 'rejectPayment'])->name('students.rejectPayment');
        Route::post('/students/{student}/update-due-payment', [StudentController::class, 'updateDuePayment'])->name('students.updateDuePayment');
        Route::post('/students/{student}/mark-registration-complete', [StudentController::class, 'markRegistrationComplete'])->name('students.markRegistrationComplete');
        Route::post('/students/bulk-mark-registration-complete', [StudentController::class, 'bulkMarkRegistrationComplete'])->name('students.bulkMarkRegistrationComplete');
        Route::resource('/courses', App\Http\Controllers\CourseController::class);
        Route::resource('/batches', BatchController::class);

        // Accounts Module Routes
        Route::resource('/ledgers', App\Http\Controllers\LedgerController::class);
        Route::resource('/expenses', App\Http\Controllers\ExpenseController::class);
        Route::resource('/incomes', App\Http\Controllers\IncomeController::class);

        // HRM Module Routes
        Route::resource('/employees', App\Http\Controllers\EmployeeController::class);
        Route::resource('/employee-attendances', App\Http\Controllers\EmployeeAttendanceController::class)->except(['create', 'store', 'show']);
        Route::get('/employee-attendances/create-bulk', [App\Http\Controllers\EmployeeAttendanceController::class, 'createBulk'])->name('employee-attendances.createBulk');
        Route::post('/employee-attendances/store-bulk', [App\Http\Controllers\EmployeeAttendanceController::class, 'storeBulk'])->name('employee-attendances.storeBulk');

        Route::resource('/student-attendances', App\Http\Controllers\StudentAttendanceController::class)->except(['create', 'store', 'show']);
        Route::get('/student-attendances/create-bulk', [App\Http\Controllers\StudentAttendanceController::class, 'createBulk'])->name('student-attendances.createBulk');
        Route::post('/student-attendances/store-bulk', [App\Http\Controllers\StudentAttendanceController::class, 'storeBulk'])->name('student-attendances.storeBulk');

        

        // HRM Reports
        Route::get('/reports/attendance', [App\Http\Controllers\AttendanceReportController::class, 'index'])->name('reports.attendance');
        Route::get('/reports/student-attendance', [App\Http\Controllers\StudentAttendanceReportController::class, 'index'])->name('reports.studentAttendance');
        Route::get('/reports/expenses', [App\Http\Controllers\ReportController::class, 'ledgerWiseExpenses'])->name('reports.expenses');
        Route::get('/reports/incomes', [App\Http\Controllers\ReportController::class, 'ledgerWiseIncomes'])->name('reports.incomes');
        Route::get('/reports/profit-loss', [App\Http\Controllers\ReportController::class, 'profitLoss'])->name('reports.profitLoss');
        Route::get('/reports/expenses/export', [App\Http\Controllers\ReportController::class, 'exportLedgerWiseExpenses'])->name('reports.exportLedgerWiseExpenses');
        Route::get('/reports/incomes/export', [App\Http\Controllers\ReportController::class, 'exportLedgerWiseIncomes'])->name('reports.exportLedgerWiseIncomes');
        Route::get('/reports/profit-loss/export', [App\Http\Controllers\ReportController::class, 'exportProfitLoss'])->name('reports.exportProfitLoss');

        // Student Admission Report
        Route::get('/reports/student-admission', [App\Http\Controllers\StudentAdmissionReportController::class, 'index'])->name('reports.studentAdmission');

    });
});

require __DIR__ . '/auth.php';

Route::post('/register-student', [StudentController::class, 'store'])->name('student.register');

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

        Route::get('/employees', [App\Http\Controllers\EmployeeController::class, 'getAllEmployees']);
        Route::get('/students', [StudentController::class, 'getAllStudents']);
        Route::get('/reports/attendance/daily', [App\Http\Controllers\AttendanceReportController::class, 'getDailyAttendance']);
        Route::get('/reports/attendance/daily/export', [App\Http\Controllers\AttendanceReportController::class, 'exportDailyAttendance']);
        Route::get('/reports/attendance/monthly', [App\Http\Controllers\AttendanceReportController::class, 'getMonthlyAttendance']);
        Route::get('/reports/attendance/monthly/export', [App\Http\Controllers\AttendanceReportController::class, 'exportMonthlyAttendance']);
        Route::get('/reports/attendance/continuous', [App\Http\Controllers\AttendanceReportController::class, 'getContinuousAttendance']);
        Route::get('/reports/attendance/continuous/export', [App\Http\Controllers\AttendanceReportController::class, 'exportContinuousAttendance']);

        // Student Attendance Reports
        Route::get('/reports/student-attendance', [App\Http\Controllers\StudentAttendanceReportController::class, 'index'])->name('reports.studentAttendance');
        Route::get('/reports/student-attendance/daily', [App\Http\Controllers\StudentAttendanceReportController::class, 'getDailyAttendance']);
        Route::get('/reports/student-attendance/daily/export', [App\Http\Controllers\StudentAttendanceReportController::class, 'exportDailyAttendance']);
        Route::get('/reports/student-attendance/monthly', [App\Http\Controllers\StudentAttendanceReportController::class, 'getMonthlyAttendance']);
        Route::get('/reports/student-attendance/monthly/export', [App\Http\Controllers\StudentAttendanceReportController::class, 'exportMonthlyAttendance']);
        Route::get('/reports/student-attendance/continuous', [App\Http\Controllers\StudentAttendanceReportController::class, 'getContinuousAttendance']);
        Route::get('/reports/student-attendance/continuous/export', [App\Http\Controllers\StudentAttendanceReportController::class, 'exportContinuousAttendance']);

        // Student Admission Report API routes
        Route::get('/reports/student-admission/daily', [App\Http\Controllers\StudentAdmissionReportController::class, 'getDailyReport'])->name('api.reports.student-admission.daily');
        Route::get('/reports/student-admission/monthly', [App\Http\Controllers\StudentAdmissionReportController::class, 'getMonthlyReport'])->name('api.reports.student-admission.monthly');
        Route::get('/reports/student-admission/continuous', [App\Http\Controllers\StudentAdmissionReportController::class, 'getContinuousReport']);
        Route::get('/reports/student-admission/daily/export/{type}', [App\Http\Controllers\StudentAdmissionReportController::class, 'exportDailyReport']);
        Route::get('/reports/student-admission/monthly/export/{type}', [App\Http\Controllers\StudentAdmissionReportController::class, 'exportMonthlyReport']);
        Route::get('/reports/student-admission/continuous/export/{type}', [App\Http\Controllers\StudentAdmissionReportController::class, 'exportContinuousReport']);
        Route::get('/students/all', [App\Http\Controllers\StudentAdmissionReportController::class, 'getAllStudents'])->name('api.students.all');
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
