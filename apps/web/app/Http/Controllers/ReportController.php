<?php

namespace App\Http\Controllers;

use App\Models\CashRegister;
use App\Models\Sale;
use App\Models\Expense;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    private function authorizeReportAccess()
    {
        $user = Auth::user();
        if (!in_array($user->role, ['admin', 'owner', 'auditor'])) {
            abort(403, 'No tienes permisos para acceder a reportes gerenciales.');
        }
    }

    /**
     * Construye los datos consolidados para rango de fechas, cajero y método de pago (UC-27 & CU-29).
     */
    private function buildReportData(Request $request): array
    {
        $defaultFrom = Carbon::now()->startOfMonth()->format('Y-m-d');
        $defaultTo = Carbon::now()->format('Y-m-d');

        $dateFrom = $request->input('date_from', $request->input('date', $defaultFrom));
        $dateTo = $request->input('date_to', $request->input('date', $defaultTo));
        $userId = $request->input('user_id', '');
        $paymentMethod = $request->input('payment_method', '');

        $dateError = null;
        if ($dateFrom && $dateTo && $dateFrom > $dateTo) {
            $dateError = 'La "Fecha Desde" no puede ser posterior a la "Fecha Hasta".';
            $dateFrom = $defaultFrom;
            $dateTo = $defaultTo;
        }

        $processBreakdown = function ($items, $filterMethod) {
            $breakdown = [];
            $total = 0;

            foreach ($items as $item) {
                if ($item->payment_method === 'multiple' && $item->payments) {
                    foreach ($item->payments as $payment) {
                        $method = $payment->payment_method ?? 'cash';
                        if ($filterMethod && $method !== $filterMethod) {
                            continue;
                        }
                        $amount = (float) $payment->amount;
                        $breakdown[$method] = ($breakdown[$method] ?? 0) + $amount;
                        $total += $amount;
                    }
                } else {
                    $method = $item->payment_method ?? 'cash';
                    if ($filterMethod && $method !== $filterMethod) {
                        continue;
                    }
                    $amount = 0;
                    if (isset($item->total_price)) {
                        $amount = (float) $item->total_price;
                    } elseif (isset($item->amount)) {
                        $amount = (float) $item->amount;
                    } elseif (isset($item->total_cost)) {
                        $amount = (float) $item->total_cost;
                    }

                    $breakdown[$method] = ($breakdown[$method] ?? 0) + $amount;
                    $total += $amount;
                }
            }

            return ['total' => $total, 'breakdown' => $breakdown];
        };

        // Ventas en rango
        $salesQuery = Sale::whereDate('sale_date', '>=', $dateFrom)
            ->whereDate('sale_date', '<=', $dateTo)
            ->with('payments');
        if ($userId) {
            $salesQuery->where('user_id', $userId);
        }
        $salesRecords = $salesQuery->get();
        $salesData = $processBreakdown($salesRecords, $paymentMethod);

        // Gastos operativos en rango
        $expensesQuery = Expense::whereDate('date', '>=', $dateFrom)
            ->whereDate('date', '<=', $dateTo)
            ->with('payments');
        if ($userId) {
            $expensesQuery->where('user_id', $userId);
        }
        $expenseRecords = $expensesQuery->get();
        $expensesData = $processBreakdown($expenseRecords, $paymentMethod);

        // Compras en rango
        $purchasesQuery = Purchase::whereDate('date', '>=', $dateFrom)
            ->whereDate('date', '<=', $dateTo)
            ->with('payments');
        if ($userId) {
            $purchasesQuery->where('user_id', $userId);
        }
        $purchaseRecords = $purchasesQuery->get();
        $purchasesData = $processBreakdown($purchaseRecords, $paymentMethod);

        $netProfit = $salesData['total'] - $expensesData['total'] - $purchasesData['total'];

        // Cierres de caja en rango (UC-29)
        $closuresQuery = CashRegister::with(['user', 'movements'])
            ->whereDate('closed_at', '>=', $dateFrom)
            ->whereDate('closed_at', '<=', $dateTo)
            ->where('status', 'closed')
            ->latest('closed_at');
        if ($userId) {
            $closuresQuery->where('user_id', $userId);
        }

        $closures = $closuresQuery->get()->map(function ($closure) {
            $income = (float) $closure->movements->whereIn('type', ['income', 'sale'])->sum('amount');
            $expense = (float) $closure->movements->whereIn('type', ['expense', 'purchase'])->sum('amount');
            $salesTotal = (float) $closure->movements->where('type', 'sale')->sum('amount');
            $manualIncome = (float) $closure->movements->where('type', 'income')->sum('amount');
            $expectedBalance = (float) $closure->opening_amount + $income - $expense;

            return [
                'id' => $closure->id,
                'user' => $closure->user ? $closure->user->name : 'Usuario Eliminado',
                'opened_at' => $closure->opened_at,
                'closed_at' => $closure->closed_at,
                'opening_amount' => (float) $closure->opening_amount,
                'sales_total' => $salesTotal,
                'manual_income' => $manualIncome,
                'total_income' => $income,
                'total_expense' => $expense,
                'expected_balance' => $expectedBalance,
                'closing_amount' => (float) $closure->closing_amount,
                'difference' => (float) $closure->closing_amount - $expectedBalance,
                'movements' => $closure->movements->map(function ($mov) {
                    return [
                        'id' => $mov->id,
                        'type' => $mov->type,
                        'amount' => (float) $mov->amount,
                        'description' => $mov->description,
                        'created_at' => $mov->created_at,
                    ];
                })->values(),
            ];
        });

        $cashiers = User::select('id', 'name', 'role')->orderBy('name')->get();

        return [
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
            'user_id' => $userId,
            'payment_method' => $paymentMethod,
            'dateError' => $dateError,
            'sales' => $salesData['total'],
            'salesCount' => $salesRecords->count(),
            'salesBreakdown' => $salesData['breakdown'],
            'expenses' => $expensesData['total'],
            'expensesBreakdown' => $expensesData['breakdown'],
            'purchases' => $purchasesData['total'],
            'purchasesBreakdown' => $purchasesData['breakdown'],
            'netProfit' => $netProfit,
            'closures' => $closures,
            'cashiers' => $cashiers,
        ];
    }

    public function index(Request $request)
    {
        $this->authorizeReportAccess();
        $data = $this->buildReportData($request);

        return \Inertia\Inertia::render('Reports/Index', $data);
    }

    public function downloadPdf(Request $request)
    {
        $this->authorizeReportAccess();
        $data = $this->buildReportData($request);

        $data['generatedAt'] = now()->format('d/m/Y H:i:s');
        $data['generatedBy'] = Auth::user()->name;
        $data['integrityHash'] = hash('sha256', json_encode([
            $data['date_from'],
            $data['date_to'],
            $data['sales'],
            $data['expenses'],
            $data['purchases'],
            $data['netProfit'],
            $data['closures']->count(),
        ]));

        $pdf = Pdf::loadView('reports.consolidated_report_pdf', $data);

        return $pdf->download("Reporte_Consolidado_{$data['date_from']}_a_{$data['date_to']}.pdf");
    }

    public function downloadCsv(Request $request)
    {
        $this->authorizeReportAccess();
        $data = $this->buildReportData($request);

        $filename = "Reporte_Consolidado_{$data['date_from']}_a_{$data['date_to']}.csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($data) {
            $handle = fopen('php://output', 'w');
            // BOM UTF-8 para Excel
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, ['Reporte Consolidado de Ventas y Rendicion de Caja - Owens']);
            fputcsv($handle, ['Desde', $data['date_from'], 'Hasta', $data['date_to']]);
            fputcsv($handle, []);
            fputcsv($handle, ['Concepto', 'Monto']);
            fputcsv($handle, ['Ventas Totales', number_format($data['sales'], 2, '.', '')]);
            fputcsv($handle, ['Gastos Operativos', number_format($data['expenses'], 2, '.', '')]);
            fputcsv($handle, ['Compras (Inventario)', number_format($data['purchases'], 2, '.', '')]);
            fputcsv($handle, ['Resultado Neto', number_format($data['netProfit'], 2, '.', '')]);
            fputcsv($handle, []);
            fputcsv($handle, ['Cierres de Caja']);
            fputcsv($handle, ['ID', 'Responsable', 'Apertura', 'Cierre', 'Fondo Inicial', 'Ingresos', 'Egresos', 'Saldo Esperado', 'Efectivo Declarado', 'Diferencia']);

            foreach ($data['closures'] as $c) {
                fputcsv($handle, [
                    $c['id'],
                    $c['user'],
                    $c['opened_at'],
                    $c['closed_at'],
                    number_format($c['opening_amount'], 2, '.', ''),
                    number_format($c['total_income'], 2, '.', ''),
                    number_format($c['total_expense'], 2, '.', ''),
                    number_format($c['expected_balance'], 2, '.', ''),
                    number_format($c['closing_amount'], 2, '.', ''),
                    number_format($c['difference'], 2, '.', ''),
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
