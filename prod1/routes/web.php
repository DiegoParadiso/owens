<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\CashRegisterController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;





Route::get('/', function () {
    return Inertia::render('Landing');
})->name('landing');

Route::get('/hacer-pedido', function () {
    return Inertia::render('BurgerSelector');
})->name('burger.select');

Route::get('/admin', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/admin/login', [UserController::class, 'loginCheck'])
    ->middleware(['throttle:5,1'])
    ->name('login.check');

// Rutas protegidas con autenticación
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/logout', [UserController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Menu (formerly Combos)
    Route::get('/menu', [ProductController::class, 'indexMenu'])->name('product.indexMenu');
    Route::post('/menu', [ProductController::class, 'storeMenu'])->name('product.storeMenu');
    Route::put('/menu/{id}', [ProductController::class, 'updateMenu'])->name('product.updateMenu');

    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('product.index');
    Route::post('/products', [ProductController::class, 'store'])->name('product.store');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('product.destroy');

    // Sales
    Route::get('/sales', [SalesController::class, 'index'])->name('sales.index');
    Route::get('/sales/create', [SalesController::class, 'create'])->name('sales.create');
    Route::post('/sales', [SalesController::class, 'store'])->name('sales.store');
    Route::delete('/sales/{id}', [SalesController::class, 'destroy'])->name('sales.destroy');



    // Expenses
    Route::get('/expenses', [ExpenseController::class, 'index'])->name('expense.index');
    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expense.store');
    Route::put('/expenses/{expense}', [ExpenseController::class, 'update'])->name('expense.update');
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expense.destroy');

    // Purchases
    Route::get('/purchases', [\App\Http\Controllers\PurchaseController::class, 'index'])->name('purchase.index');
    Route::post('/purchases', [\App\Http\Controllers\PurchaseController::class, 'store'])->name('purchase.store');
    Route::put('/purchases/{purchase}', [\App\Http\Controllers\PurchaseController::class, 'update'])->name('purchase.update');
    Route::delete('/purchases/{purchase}', [\App\Http\Controllers\PurchaseController::class, 'destroy'])->name('purchase.destroy');

    // Suppliers
    Route::get('/suppliers', [\App\Http\Controllers\SupplierController::class, 'index'])->name('supplier.index');
    Route::post('/suppliers', [\App\Http\Controllers\SupplierController::class, 'store'])->name('supplier.store');
    Route::put('/suppliers/{supplier}', [\App\Http\Controllers\SupplierController::class, 'update'])->name('supplier.update');
    Route::delete('/suppliers/{supplier}', [\App\Http\Controllers\SupplierController::class, 'destroy'])->name('supplier.destroy');

    // Expense Categories
    Route::get('/expense-categories', [ExpenseCategoryController::class, 'index'])->name('expense-categories.index');
    Route::post('/expense-categories', [ExpenseCategoryController::class, 'store'])->name('expense-categories.store');
    Route::put('/expense-categories/{category}', [ExpenseCategoryController::class, 'update'])->name('expense-categories.update');
    Route::delete('/expense-categories/{category}', [ExpenseCategoryController::class, 'destroy'])->name('expense-categories.destroy');

    // Cash Register
    Route::get('/cash-register', [CashRegisterController::class, 'index'])->name('cash_register.index');
    Route::post('/cash-register', [CashRegisterController::class, 'store'])->name('cash_register.store');
    Route::post('/cash-register/{id}/close', [CashRegisterController::class, 'close'])->name('cash_register.close');
    Route::get('/cash-register/{id}/pdf', [CashRegisterController::class, 'downloadPdf'])->name('cash_register.downloadPdf');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('report.index');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/users', [SettingsController::class, 'storeUser'])->name('settings.storeUser');
    Route::put('/settings/users/{user}', [SettingsController::class, 'updateUser'])->name('settings.updateUser');
    Route::delete('/settings/users/{user}', [SettingsController::class, 'destroyUser'])->name('settings.destroyUser');
    Route::post('/settings/reset-database', [SettingsController::class, 'resetDatabase'])->name('settings.resetDatabase');
    Route::post('/settings/mode', [SettingsController::class, 'updateSystemMode'])->name('settings.updateMode');
    Route::post('/settings/stock', [SettingsController::class, 'updateStockSetting'])->name('settings.updateStock');
});