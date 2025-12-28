<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Expense;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportService
{
    /**
     * Get sales report for a date range
     */
    public function getSalesReport(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $query = Sale::query();
        
        if ($startDate) {
            $query->where('sale_date', '>=', $startDate);
        }
        
        if ($endDate) {
            $query->where('sale_date', '<=', $endDate);
        }
        
        $sales = $query->with('saleDetails.product')->get();
        
        $totalSales = $sales->sum('total_price');
        $totalItems = $sales->sum(function ($sale) {
            return $sale->saleDetails->sum('quantity');
        });
        
        return [
            'sales' => $sales,
            'total_sales' => $totalSales,
            'total_items' => $totalItems,
            'count' => $sales->count(),
        ];
    }

    /**
     * Get purchases report for a date range
     */
    public function getPurchasesReport(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $query = Purchase::query();
        
        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }
        
        $purchases = $query->with('purchaseDetails.product', 'supplier')->get();
        
        $totalCost = $purchases->sum('total_cost');
        
        return [
            'purchases' => $purchases,
            'total_cost' => $totalCost,
            'count' => $purchases->count(),
        ];
    }

    /**
     * Get expenses report for a date range
     */
    public function getExpensesReport(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $query = Expense::query();
        
        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }
        
        $expenses = $query->get();
        
        $totalExpenses = $expenses->sum('amount');
        
        return [
            'expenses' => $expenses,
            'total_expenses' => $totalExpenses,
            'count' => $expenses->count(),
        ];
    }

    /**
     * Get profit/loss report
     */
    public function getProfitLossReport(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $salesReport = $this->getSalesReport($startDate, $endDate);
        $purchasesReport = $this->getPurchasesReport($startDate, $endDate);
        $expensesReport = $this->getExpensesReport($startDate, $endDate);
        
        $revenue = $salesReport['total_sales'];
        $costOfGoods = $purchasesReport['total_cost'];
        $expenses = $expensesReport['total_expenses'];
        $grossProfit = $revenue - $costOfGoods;
        $netProfit = $grossProfit - $expenses;
        
        return [
            'revenue' => $revenue,
            'cost_of_goods' => $costOfGoods,
            'expenses' => $expenses,
            'gross_profit' => $grossProfit,
            'net_profit' => $netProfit,
        ];
    }
}

