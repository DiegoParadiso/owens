<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Users
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->string('role')->default('user'); // Based on seeder
                $table->rememberToken();
                $table->timestamps();
            });
        }

        // Password Reset Tokens (Standard Laravel)
        if (!Schema::hasTable('password_reset_tokens')) {
            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');
                $table->timestamp('created_at')->nullable();
            });
        }

        // Sessions (Standard Laravel with database driver)
        if (!Schema::hasTable('sessions')) {
            Schema::create('sessions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->foreignId('user_id')->nullable()->index();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->longText('payload');
                $table->integer('last_activity')->index();
            });
        }

        // Suppliers
        if (!Schema::hasTable('suppliers')) {
            Schema::create('suppliers', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('contact_info')->nullable();
                $table->timestamps();
            });
        }

        // Products
        if (!Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->decimal('price', 10, 2)->default(0); // Assuming price format
                $table->integer('stock')->default(0);
                $table->decimal('cost', 10, 2)->default(0);
                $table->string('type')->nullable(); // 'standard', 'combo', etc.
                $table->string('category')->nullable();
                $table->string('purchase_unit')->nullable();
                $table->string('usage_unit')->nullable();
                $table->decimal('conversion_factor', 10, 4)->default(1);
                // base_unit & usage_factor skipped (added by 2026 migration)
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }

        // Product Components (Ingredients/Recipes)
        if (!Schema::hasTable('product_components')) {
            Schema::create('product_components', function (Blueprint $table) {
                $table->id();
                $table->foreignId('parent_product_id')->constrained('products')->onDelete('cascade');
                $table->foreignId('child_product_id')->constrained('products')->onDelete('cascade');
                $table->decimal('quantity', 10, 4);
                $table->timestamps();
            });
        }

        // Log Stocks
        if (!Schema::hasTable('log_stocks')) {
            Schema::create('log_stocks', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
                $table->integer('quantity');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('type'); // 'in', 'out', 'adjustment'
                $table->string('description')->nullable();
                $table->timestamps();
            });
        }

        // Sales
        if (!Schema::hasTable('sales')) {
            Schema::create('sales', function (Blueprint $table) {
                $table->id();
                $table->dateTime('sale_date');
                $table->decimal('total_price', 10, 2);
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('payment_method')->nullable();
                $table->timestamps();
            });
        }

        // Sale Details
        if (!Schema::hasTable('sale_details')) {
            Schema::create('sale_details', function (Blueprint $table) {
                $table->id();
                $table->foreignId('sale_id')->constrained('sales')->onDelete('cascade');
                $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
                $table->decimal('price', 10, 2);
                $table->integer('quantity');
                $table->decimal('subtotal', 10, 2);
                // cost skipped (added by 2026 migration)
                $table->timestamps();
            });
        }

        // Payments (Legacy/Specific logic table ?)
        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('sale_id')->constrained('sales')->onDelete('cascade');
                $table->dateTime('payment_date');
                $table->decimal('amount_paid', 10, 2);
                $table->decimal('change', 10, 2)->default(0);
                $table->string('payment_status')->default('completed');
                $table->string('payment_method')->nullable();
                $table->timestamps();
            });
        }

        // Sale Payments (Multiple payments per sale)
        if (!Schema::hasTable('sale_payments')) {
            Schema::create('sale_payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('sale_id')->constrained('sales')->onDelete('cascade');
                $table->string('payment_method');
                $table->decimal('amount', 10, 2);
                $table->timestamps();
            });
        }

        // Purchases
        if (!Schema::hasTable('purchases')) {
            Schema::create('purchases', function (Blueprint $table) {
                $table->id();
                $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
                $table->decimal('total_cost', 10, 2);
                $table->dateTime('date');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('payment_method')->nullable();
                $table->timestamps();
            });
        }

        // Purchase Details
        if (!Schema::hasTable('purchase_details')) {
            Schema::create('purchase_details', function (Blueprint $table) {
                $table->id();
                $table->foreignId('purchase_id')->constrained('purchases')->onDelete('cascade');
                $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
                $table->integer('quantity');
                $table->decimal('unit_cost', 10, 2);
                $table->decimal('total_cost', 10, 2);
                $table->timestamps();
            });
        }

        // Purchase Payments
        if (!Schema::hasTable('purchase_payments')) {
            Schema::create('purchase_payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('purchase_id')->constrained('purchases')->onDelete('cascade');
                $table->string('payment_method');
                $table->decimal('amount', 10, 2);
                $table->timestamps();
            });
        }

        // Expense Categories
        if (!Schema::hasTable('expense_categories')) {
            Schema::create('expense_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('type')->nullable(); // 'fixed', 'variable'
                $table->timestamps();
            });
        }

        // Expenses
        if (!Schema::hasTable('expenses')) {
            Schema::create('expenses', function (Blueprint $table) {
                $table->id();
                $table->string('description');
                $table->decimal('amount', 10, 2);
                $table->foreignId('category_id')->nullable()->constrained('expense_categories')->nullOnDelete();
                $table->dateTime('date');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('payment_method')->nullable();
                $table->timestamps();
            });
        }

        // Expense Payments
        if (!Schema::hasTable('expense_payments')) {
            Schema::create('expense_payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('expense_id')->constrained('expenses')->onDelete('cascade');
                $table->string('payment_method');
                $table->decimal('amount', 10, 2);
                $table->timestamps();
            });
        }

        // Cash Sessions (Registers)
        if (!Schema::hasTable('cash_sessions')) {
            Schema::create('cash_sessions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users');
                $table->decimal('opening_amount', 10, 2);
                $table->decimal('closing_amount', 10, 2)->nullable();
                $table->string('status')->default('open'); // open, closed
                $table->dateTime('opened_at');
                $table->dateTime('closed_at')->nullable();
                $table->timestamps();
            });
        }

        // Cash Transactions
        if (!Schema::hasTable('cash_transactions')) {
            Schema::create('cash_transactions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('cash_session_id')->constrained('cash_sessions')->onDelete('cascade');
                $table->string('type'); // in, out
                $table->decimal('amount', 10, 2);
                $table->string('description')->nullable();
                $table->nullableMorphs('related'); // related_id, related_type
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_transactions');
        Schema::dropIfExists('cash_sessions');
        Schema::dropIfExists('expense_payments');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('expense_categories');
        Schema::dropIfExists('purchase_payments');
        Schema::dropIfExists('purchase_details');
        Schema::dropIfExists('purchases');
        Schema::dropIfExists('sale_payments');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('sale_details');
        Schema::dropIfExists('sales');
        Schema::dropIfExists('log_stocks');
        Schema::dropIfExists('product_components');
        Schema::dropIfExists('products');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
