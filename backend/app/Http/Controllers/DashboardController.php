<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\ActivityLog;
use App\Http\Resources\TaskResource;
use App\Http\Resources\ActivityLogResource;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $userId = $request->user()->id;
        $now = Carbon::now();

        $total = Task::where('user_id', $userId)->count();
        $pending = Task::where('user_id', $userId)->where('status', 'Pending')->count();
        $inProgress = Task::where('user_id', $userId)->where('status', 'In Progress')->count();
        $completed = Task::where('user_id', $userId)->where('status', 'Completed')->count();
        
        $overdue = Task::where('user_id', $userId)
            ->where('status', '!=', 'Completed')
            ->whereNotNull('due_date')
            ->where('due_date', '<', $now)
            ->count();

        // Top 5 recently created
        $recentlyCreated = Task::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Top 5 recently updated
        $recentlyUpdated = Task::where('user_id', $userId)
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'total_tasks' => $total,
            'pending_tasks' => $pending,
            'in_progress_tasks' => $inProgress,
            'completed_tasks' => $completed,
            'overdue_tasks' => $overdue,
            'recently_created' => TaskResource::collection($recentlyCreated),
            'recently_updated' => TaskResource::collection($recentlyUpdated),
        ]);
    }

    public function charts(Request $request)
    {
        $userId = $request->user()->id;

        // 1. Pie Chart - Status counts
        $pending = Task::where('user_id', $userId)->where('status', 'Pending')->count();
        $inProgress = Task::where('user_id', $userId)->where('status', 'In Progress')->count();
        $completed = Task::where('user_id', $userId)->where('status', 'Completed')->count();

        $pieChart = [
            ['status' => 'Pending', 'count' => $pending, 'color' => '#f59e0b'], // Amber
            ['status' => 'In Progress', 'count' => $inProgress, 'color' => '#3b82f6'], // Blue
            ['status' => 'Completed', 'count' => $completed, 'color' => '#10b981'], // Emerald
        ];

        // 2. Bar Chart - Weekly task counts (last 7 days including today)
        $weeklyChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $startOfDay = $date->copy()->startOfDay();
            $endOfDay = $date->copy()->endOfDay();

            $count = Task::where('user_id', $userId)
                ->whereBetween('created_at', [$startOfDay, $endOfDay])
                ->count();

            $weeklyChart[] = [
                'day' => $date->format('D'), // e.g. "Mon"
                'date' => $date->format('Y-m-d'),
                'tasks_created' => $count
            ];
        }

        return response()->json([
            'pie_chart' => $pieChart,
            'weekly_chart' => $weeklyChart,
        ]);
    }
}
