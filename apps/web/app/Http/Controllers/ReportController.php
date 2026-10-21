<?php

namespace App\Http\Controllers;

use App\Models\CashRegister;
use App\Models\Sale;
use App\Models\Expense;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->input('date', date('Y-m-d'));

        // Helper to aggregate amounts by payment method
        $processBreakdown = function($items) {
            $breakdown = [];
            $total = 0;
            
            foreach ($items as $item) {
                if ($item->payment_method === 'multiple' && $item->payments) {
                    foreach ($item->payments as $payment) {
                        $method = $payment->payment_method ?? 'cash';
                        $amount = (float) $payment->amount; 
                        $breakdown[$method] = ($breakdown[$method] ?? 0) + $amount;
                        $total += $amount;
                    }
                } else {
                    $method = $item->payment_method ?? 'cash';
                    $amount = 0;
                    if (isset($item->total_price)) $amount = (float) $item->total_price;
                    elseif (isset($item->amount)) $amount = (float) $item->amount;
                    elseif (isset($item->total_cost)) $amount = (float) $item->total_cost;
                    
                    $breakdown[$method] = ($breakdown[$method] ?? 0) + $amount;
                    $total += $amount;
                }
            }
            return ['total' => $total, 'breakdown' => $breakdown];
        };

        // Sales for the day
        $salesRecords = Sale::whereDate('sale_date', $date)->with('payments')->get();
        $salesData = $processBreakdown($salesRecords);
        
        // Expenses for the day  
        $expenseRecords = Expense::whereDate('date', $date)->with('payments')->get();
        $expensesData = $processBreakdown($expenseRecords);

        // Purchases for the day
        $purchaseRecords = \App\Models\Purchase::whereDate('date', $date)->with('payments')->get();
        $purchasesData = $processBreakdown($purchaseRecords);

        $netProfit = $salesData['total'] - $expensesData['total'] - $purchasesData['total'];

        // Fetch closures for the selected date
        $closures = \App\Models\CashRegister::with('user')
            ->whereDate('closed_at', $date)
            ->where('status', 'closed')
            ->latest('closed_at')
            ->get()
            ->map(function ($closure) {
                return [
                    'id' => $closure->id,
                    'user' => $closure->user ? $closure->user->name : 'Usuario Eliminado',
                    'opened_at' => $closure->opened_at,
                    'closed_at' => $closure->closed_at,
                    'opening_amount' => $closure->opening_amount,
                    'closing_amount' => $closure->closing_amount,
                    'difference' => $closure->closing_amount - ($closure->opening_amount + $closure->movements()->whereIn('type', ['income', 'sale'])->sum('amount') - $closure->movements()->where('type', 'expense')->sum('amount'))
                ];
            });

        return \Inertia\Inertia::render('Reports/Index', [
            'date' => $date,
            'sales' => $salesData['total'],
            'salesBreakdown' => $salesData['breakdown'],
            'expenses' => $expensesData['total'],
            'expensesBreakdown' => $expensesData['breakdown'],
            'purchases' => $purchasesData['total'],
            'purchasesBreakdown' => $purchasesData['breakdown'],
            'netProfit' => $netProfit,
            'closures' => $closures
        ]);
    }
}
