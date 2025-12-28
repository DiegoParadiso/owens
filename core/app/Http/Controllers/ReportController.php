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
        $title = 'Reportes';
        $subtitle = 'Balance Diario';
        
        $date = $request->input('date', date('Y-m-d'));

        // Sales for the day
        $sales = Sale::whereDate('created_at', $date)->sum('total_price');
        
        // Expenses for the day
        $expenses = Expense::whereDate('expense_date', $date)->sum('amount'); // Assuming expense_date is the column name in new schema

        // Purchases (Cost of Goods Sold - simplified as purchases for now, or we can calculate profit margin)
        // For "Real Result", we usually mean (Sales - COGS - Expenses).
        // Let's calculate Gross Profit based on product cost.
        
        $salesData = Sale::with('saleDetails.product')->whereDate('created_at', $date)->get();
        $totalCostOfGoods = 0;
        foreach ($salesData as $sale) {
            foreach ($sale->saleDetails as $detail) {
                $totalCostOfGoods += $detail->product->cost * $detail->quantity;
            }
        }

        $grossProfit = $sales - $totalCostOfGoods;
        $netProfit = $grossProfit - $expenses;

        return view('admin.report.index', compact('title', 'subtitle', 'date', 'sales', 'expenses', 'totalCostOfGoods', 'grossProfit', 'netProfit'));
    }
}
