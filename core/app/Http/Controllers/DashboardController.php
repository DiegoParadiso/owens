<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Data penjualan hari ini
        $today = Carbon::today();
        $todaySales = Sale::whereDate('sale_date', $today)->get();
        $todaySalesCount = $todaySales->count();
        $todayRevenue = $todaySales->sum('total_price');

        // Total semua penjualan
        $totalSalesCount = Sale::count();
        $totalRevenue = Sale::sum('total_price');

        // Penjualan terbaru (limit 5)
        $recentSales = Sale::with(['user', 'payment'])->latest()->take(5)->get();

        // Data chart penjualan dan revenue 7 hari terakhir
        $last7Days = Carbon::now()->subDays(6);
        $salesPerDay = Sale::select(
            DB::raw('DATE(sale_date) as date'),
            DB::raw('COUNT(*) as total_sales'),
            DB::raw('SUM(total_price) as total_revenue')
        )
            ->whereDate('sale_date', '>=', $last7Days)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $chartLabels = [];
        $chartSalesData = [];
        $chartRevenueData = [];

        // Inisialisasi label dan data 7 hari ke belakang
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $label = Carbon::now()->subDays($i)->format('d M');
            $chartLabels[] = $label;

            $dayData = $salesPerDay->firstWhere('date', $date);
            $chartSalesData[] = $dayData ? (int) $dayData->total_sales : 0;
            $chartRevenueData[] = $dayData ? (int) $dayData->total_revenue : 0;
        }

        // Status Cash Register
        $openRegister = \App\Models\CashRegister::where('user_id', auth()->id())
            ->where('status', 'open')
            ->first();

        $currentBalance = 0;
        if ($openRegister) {
            $income = $openRegister->movements()->where('type', 'income')->sum('amount');
            $expense = $openRegister->movements()->where('type', 'expense')->sum('amount');
            $currentBalance = $openRegister->opening_amount + $income - $expense;
        }

        return view('admin.dashboard', compact(
            'todaySalesCount',
            'totalSalesCount',
            'todayRevenue',
            'totalRevenue',
            'recentSales',
            'chartLabels',
            'chartSalesData',
            'chartRevenueData',
            'openRegister',
            'currentBalance'
        ));
    }
}
