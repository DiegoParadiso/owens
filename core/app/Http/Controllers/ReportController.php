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

        // Sales for the day
        $sales = Sale::whereDate('sale_date', $date)->sum('total_price') ?? 0;
        
        // Expenses for the day  
        $expenses = Expense::whereDate('date', $date)->sum('amount') ?? 0;

        // Purchases for the day
        $purchases = \App\Models\Purchase::whereDate('date', $date)->sum('total_cost') ?? 0;

        // Calculate COGS
        $salesData = Sale::with('saleDetails.product')->whereDate('sale_date', $date)->get();
        $totalCostOfGoods = 0;
        foreach ($salesData as $sale) {
            foreach ($sale->saleDetails as $detail) {
                $totalCostOfGoods += ($detail->product->cost ?? 0) * $detail->quantity;
            }
        }

        $grossProfit = $sales - $totalCostOfGoods;
        $netProfit = $grossProfit - $expenses;

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
                    'difference' => $closure->closing_amount - ($closure->opening_amount + $closure->movements()->where('type', 'income')->sum('amount') - $closure->movements()->where('type', 'expense')->sum('amount'))
                ];
            });

        return \Inertia\Inertia::render('Reports/Index', [
            'date' => $date,
            'sales' => $sales,
            'expenses' => $expenses,
            'purchases' => $purchases,
            'cogs' => $totalCostOfGoods,
            'grossProfit' => $grossProfit,
            'netProfit' => $netProfit,
            'closures' => $closures
        ]);
    }
}
