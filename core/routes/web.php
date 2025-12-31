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
use App\Http\Controllers\CashRegisterController;
use App\Http\Controllers\ReportController;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/login', [UserController::class, 'loginCheck'])->name('login.check');

// Rutas protegidas con autenticación
Route::middleware(['auth'])->group(function () {
    Route::get('/logout', [UserController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Combos
    Route::get('/combos', [ProductController::class, 'indexCombo'])->name('product.indexCombo');
    Route::post('/combos', [ProductController::class, 'storeCombo'])->name('product.storeCombo');

    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('product.index');
    Route::post('/products', [ProductController::class, 'store'])->name('product.store');
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('product.destroy');

    // Sales
    Route::get('/sales', [SalesController::class, 'index'])->name('sales.index');
    Route::get('/sales/create', [SalesController::class, 'create'])->name('sales.create');
    Route::post('/sales', [SalesController::class, 'store'])->name('sales.store');

    // Purchases
    Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchase.index');
    Route::get('/purchases/create', [PurchaseController::class, 'create'])->name('purchase.create');
    Route::post('/purchases', [PurchaseController::class, 'store'])->name('purchase.store');

    // Suppliers
    Route::get('/suppliers', [SupplierController::class, 'index'])->name('supplier.index');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('supplier.store');
    Route::get('/suppliers/{id}/edit', [SupplierController::class, 'edit'])->name('supplier.edit');
    Route::put('/suppliers/{id}', [SupplierController::class, 'update'])->name('supplier.update');
    Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy'])->name('supplier.destroy');

    // Expenses
    Route::get('/expenses', [ExpenseController::class, 'index'])->name('expense.index');
    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expense.store');

    // Cash Register
    Route::get('/cash-register', [CashRegisterController::class, 'index'])->name('cash_register.index');
    Route::post('/cash-register', [CashRegisterController::class, 'store'])->name('cash_register.store');
    Route::post('/cash-register/{id}/close', [CashRegisterController::class, 'close'])->name('cash_register.close');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('report.index');
});