<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/', [UserController::class, 'login'])->name('login');
    Route::post('/login', [UserController::class, 'loginCheck'])->name('login.check');
});



Route::get('logout', [UserController::class, 'logout'])->name('logout');

Route::group(['middleware' => ['auth']], function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('product/print/label', [ProductController::class, 'printLabel'])->name('product.printLabel');
    Route::put('product/edit/{id}/addStock', [ProductController::class, 'addStock'])->name('product.addStock');
    // Route::get('product/logproduct', [ProductController::class, 'logProduct'])->name('product.logProduct');
    Route::get('product/combos', [ProductController::class, 'indexCombo'])->name('product.indexCombo');
    Route::resource('product', ProductController::class);
    Route::resource('sales', SalesController::class);
    Route::get('sales/payCash/{id}', [SalesController::class, 'payCash'])->name('sales.payCash');
    Route::post('sales/payCash', [SalesController::class, 'storeCashPayment'])->name('sales.storeCashPayment');
    Route::get('sales/receipt/{id}', [SalesController::class, 'receipt'])->name('sales.receipt');

    // Suppliers
    Route::resource('supplier', \App\Http\Controllers\SupplierController::class);

    // Purchases
    Route::get('purchase', [\App\Http\Controllers\PurchaseController::class, 'index'])->name('purchase.index');
    Route::get('purchase/create', [\App\Http\Controllers\PurchaseController::class, 'create'])->name('purchase.create');
    Route::post('purchase', [\App\Http\Controllers\PurchaseController::class, 'store'])->name('purchase.store');

    // Cash Register
    Route::get('cash_register', [\App\Http\Controllers\CashRegisterController::class, 'index'])->name('cash_register.index');
    Route::get('cash_register/create', [\App\Http\Controllers\CashRegisterController::class, 'create'])->name('cash_register.create');
    Route::post('cash_register', [\App\Http\Controllers\CashRegisterController::class, 'store'])->name('cash_register.store');
    Route::put('cash_register/{id}/close', [\App\Http\Controllers\CashRegisterController::class, 'close'])->name('cash_register.close');

    // Expenses
    Route::get('expense', [\App\Http\Controllers\ExpenseController::class, 'index'])->name('expense.index');
    Route::get('expense/create', [\App\Http\Controllers\ExpenseController::class, 'create'])->name('expense.create');
    Route::post('expense', [\App\Http\Controllers\ExpenseController::class, 'store'])->name('expense.store');

    // Combos
    Route::get('product/combo/create', [ProductController::class, 'createCombo'])->name('product.createCombo');
    Route::post('product/combo', [ProductController::class, 'storeCombo'])->name('product.storeCombo');

    // Reports
    Route::get('report', [\App\Http\Controllers\ReportController::class, 'index'])->name('report.index');
});