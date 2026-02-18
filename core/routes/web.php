<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\CashRegisterController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\WhatsAppController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\TableController;

Route::match(['get', 'post'], '/webhook/whatsapp', [WhatsAppController::class, 'verifyWebhook'])->name('whatsapp.webhook');
Route::post('/webhook/whatsapp', [WhatsAppController::class, 'handleWebhook']); // Explicit POST handler if needed or use match logic



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

    // Purchases
    Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchase.index');
    Route::get('/purchases/create', [PurchaseController::class, 'create'])->name('purchase.create');
    Route::post('/purchases', [PurchaseController::class, 'store'])->name('purchase.store');
    Route::put('/purchases/{purchase}', [PurchaseController::class, 'update'])->name('purchase.update');
    Route::delete('/purchases/{purchase}', [PurchaseController::class, 'destroy'])->name('purchase.destroy');

    // Suppliers
    Route::get('/suppliers', [SupplierController::class, 'index'])->name('supplier.index');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('supplier.store');
    Route::get('/suppliers/{id}/edit', [SupplierController::class, 'edit'])->name('supplier.edit');
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->name('supplier.update');
    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('supplier.destroy');

    // Expenses
    Route::get('/expenses', [ExpenseController::class, 'index'])->name('expense.index');
    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expense.store');
    Route::put('/expenses/{expense}', [ExpenseController::class, 'update'])->name('expense.update');
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expense.destroy');

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
    // Production
    Route::get('/production/formulas', [ProductionController::class, 'formulas'])->name('production.formulas');
    Route::post('/production/formulas', [ProductionController::class, 'storeFormula'])->name('production.storeFormula');
    Route::delete('/production/formulas/{id}', [ProductionController::class, 'destroyFormula'])->name('production.destroyFormula');
    Route::get('/production', [ProductionController::class, 'index'])->name('production.index');
    Route::post('/production', [ProductionController::class, 'store'])->name('production.store');

    // WhatsApp
    Route::get('/whatsapp', [WhatsAppController::class, 'index'])->name('whatsapp.index');
    Route::post('/whatsapp/token', [WhatsAppController::class, 'storeToken'])->name('whatsapp.storeToken');
    Route::post('/whatsapp/logout', [WhatsAppController::class, 'logout'])->name('whatsapp.logout');
    
    // Tables
    Route::get('/tables', [TableController::class, 'index'])->name('tables.index');
    Route::post('/tables', [TableController::class, 'store'])->name('tables.store');
    Route::post('/production/product/{id}/icon', [ProductionController::class, 'updateIcon'])->name('production.updateIcon');
    Route::post('/tables/positions', [TableController::class, 'updatePositions'])->name('tables.updatePositions');
    Route::delete('/tables/{id}', [TableController::class, 'destroy'])->name('tables.destroy');
});