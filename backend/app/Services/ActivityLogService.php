<?php

namespace App\Services;

use App\Models\ActivityLog;
use Carbon\Carbon;

class ActivityLogService
{
    public function log(string $userId, ?string $taskId, string $action): ActivityLog
    {
        return ActivityLog::create([
            'user_id' => $userId,
            'task_id' => $taskId,
            'action' => $action,
            'created_at' => Carbon::now(),
        ]);
    }

    public function getLogsForUser(string $userId, int $limit = 50)
    {
        // Return logs with task preloaded if possible
        return ActivityLog::with('task')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
