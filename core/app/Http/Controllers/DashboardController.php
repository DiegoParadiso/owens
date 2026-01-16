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
        try {
            // Ventas de hoy
            $today = Carbon::today();
            $todaySalesCount = Sale::whereDate('sale_date', $today)->count();
            $todayRevenue = Sale::whereDate('sale_date', $today)->sum('total_price') ?? 0;

            // Total de todas las ventas
            $totalSalesCount = Sale::count();
            $totalRevenue = Sale::sum('total_price') ?? 0;

            // Ventas recientes (últimas 5)
            $recentSales = Sale::with(['user', 'payment', 'saleDetails.product'])->latest()->take(5)->get();

            // Datos de gráficos (últimos 7 días)
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

            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->format('Y-m-d');
                $chartLabels[] = Carbon::now()->subDays($i)->format('d M');

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
                $income = $openRegister->movements()->where('type', 'income')->sum('amount') ?? 0;
                $expense = $openRegister->movements()->where('type', 'expense')->sum('amount') ?? 0;
                $currentBalance = $openRegister->opening_amount + $income - $expense;
            }
        } catch (\Exception $e) {
            // Si las tablas no existen aún, usar datos vacíos
            $todaySalesCount = 0;
            $todayRevenue = 0;
            $totalSalesCount = 0;
            $totalRevenue = 0;
            $recentSales = collect([]);
            $chartLabels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
            $chartSalesData = [0, 0, 0, 0, 0, 0, 0];
            $chartRevenueData = [0, 0, 0, 0, 0, 0, 0];
            $currentBalance = 0;
        }

        return \Inertia\Inertia::render('Dashboard', [
            'stats' => [
                'todaySales' => $todaySalesCount,
                'totalSales' => $totalSalesCount,
                'todayRevenue' => $todayRevenue,
                'totalRevenue' => $totalRevenue,
            ],
            'recentSales' => $recentSales->map(function($sale) {
                return [
                    'id' => $sale->id,
                    'sale_date' => $sale->sale_date, // Pass full date for formatting
                    'invoice' => 'INV-' . str_pad($sale->id, 5, '0', STR_PAD_LEFT),
                    'cashier' => $sale->user->name ?? 'Sistema',
                    'total_price' => $sale->total_price, // Match sales index param name
                    'payment_method' => $sale->payment_method,
                    'sale_details' => $sale->saleDetails->map(function($detail) {
                        return [
                            'quantity' => $detail->quantity,
                            'product' => [
                                'name' => $detail->product->name ?? 'Producto eliminado'
                            ]
                        ];
                    }),
                ];
            }),
            'chartData' => [
                'labels' => $chartLabels,
                'sales' => $chartSalesData,
                'revenue' => $chartRevenueData,
            ],
            'cashRegister' => [
                'isOpen' => false,
                'currentBalance' => $currentBalance,
            ],
        ]);
    }
}
