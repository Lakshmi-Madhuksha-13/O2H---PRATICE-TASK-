<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    protected $activityLogService;

    public function __construct(ActivityLogService $activityLogService)
    {
        $this->activityLogService = $activityLogService;
    }

    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 50);
        $logs = $this->activityLogService->getLogsForUser($request->user()->id, $limit);

        return ActivityLogResource::collection($logs);
    }
}
