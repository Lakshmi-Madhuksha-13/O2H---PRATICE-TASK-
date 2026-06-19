<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Http\Resources\TaskResource;
use App\Services\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index(Request $request)
    {
        $filters = [
            'status' => $request->query('status'),
            'priority' => $request->query('priority'),
        ];

        $search = $request->query('search');
        $sortBy = $request->query('sort_by', 'created_at');
        $sortOrder = $request->query('sort_order', 'desc');
        $perPage = (int) $request->query('per_page', 10);

        $tasks = $this->taskService->getPaginatedTasks(
            $request->user()->id,
            $filters,
            $search,
            $sortBy,
            $sortOrder,
            $perPage
        );

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $this->taskService->createTask($request->user()->id, $request->validated());

        return response()->json([
            'message' => 'Task created successfully.',
            'task' => new TaskResource($task),
        ], 201);
    }

    public function show(string $id, Request $request)
    {
        $task = $this->taskService->getTaskById($id, $request->user()->id);

        if (!$task) {
            return response()->json(['message' => 'Task not found.'], 404);
        }

        return new TaskResource($task);
    }

    public function update(string $id, UpdateTaskRequest $request)
    {
        $task = $this->taskService->updateTask($id, $request->user()->id, $request->validated());

        if (!$task) {
            return response()->json(['message' => 'Task not found.'], 404);
        }

        return response()->json([
            'message' => 'Task updated successfully.',
            'task' => new TaskResource($task),
        ]);
    }

    public function updateStatus(string $id, UpdateTaskStatusRequest $request)
    {
        $task = $this->taskService->updateTaskStatus($id, $request->user()->id, $request->status);

        if (!$task) {
            return response()->json(['message' => 'Task not found.'], 404);
        }

        return response()->json([
            'message' => 'Task status updated successfully.',
            'task' => new TaskResource($task),
        ]);
    }

    public function destroy(string $id, Request $request)
    {
        $deleted = $this->taskService->deleteTask($id, $request->user()->id);

        if (!$deleted) {
            return response()->json(['message' => 'Task not found or could not be deleted.'], 404);
        }

        return response()->json([
            'message' => 'Task deleted successfully.',
        ]);
    }
}
