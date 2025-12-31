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

        return \Inertia\Inertia::render('Reports/Index', [
            'date' => $date,
            'sales' => $sales,
            'expenses' => $expenses,
            'cogs' => $totalCostOfGoods,
            'grossProfit' => $grossProfit,
            'netProfit' => $netProfit,
        ]);
    }
}
