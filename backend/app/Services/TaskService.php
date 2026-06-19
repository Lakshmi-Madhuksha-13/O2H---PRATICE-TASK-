<?php

namespace App\Services;

use App\Repositories\TaskRepositoryInterface;
use App\Models\Task;

class TaskService
{
    protected $taskRepository;
    protected $activityLogService;

    public function __construct(
        TaskRepositoryInterface $taskRepository,
        ActivityLogService $activityLogService
    ) {
        $this->taskRepository = $taskRepository;
        $this->activityLogService = $activityLogService;
    }

    public function getPaginatedTasks(
        string $userId,
        array $filters = [],
        ?string $search = null,
        string $sortBy = 'created_at',
        string $sortOrder = 'desc',
        int $perPage = 10
    ) {
        return $this->taskRepository->getPaginatedForUser(
            $userId,
            $filters,
            $search,
            $sortBy,
            $sortOrder,
            $perPage
        );
    }

    public function getAllTasks(string $userId)
    {
        return $this->taskRepository->getAllForUser($userId);
    }

    public function getTaskById(string $id, string $userId): ?Task
    {
        return $this->taskRepository->getByIdForUser($id, $userId);
    }

    public function createTask(string $userId, array $data): Task
    {
        // Default status is Pending
        if (empty($data['status'])) {
            $data['status'] = 'Pending';
        }

        $task = $this->taskRepository->createForUser($userId, $data);

        // Log action
        $this->activityLogService->log($userId, $task->id, 'Task Created');

        return $task;
    }

    public function updateTask(string $id, string $userId, array $data): ?Task
    {
        $originalTask = $this->taskRepository->getByIdForUser($id, $userId);
        if (!$originalTask) {
            return null;
        }

        $originalStatus = $originalTask->status;
        $updatedTask = $this->taskRepository->updateForUser($id, $userId, $data);

        if ($updatedTask) {
            $newStatus = $updatedTask->status;
            if ($originalStatus !== $newStatus) {
                if ($newStatus === 'Completed') {
                    $this->activityLogService->log($userId, $updatedTask->id, 'Task Completed');
                } else {
                    $this->activityLogService->log($userId, $updatedTask->id, 'Task Status Changed');
                }
            } else {
                $this->activityLogService->log($userId, $updatedTask->id, 'Task Updated');
            }
        }

        return $updatedTask;
    }

    public function updateTaskStatus(string $id, string $userId, string $status): ?Task
    {
        $originalTask = $this->taskRepository->getByIdForUser($id, $userId);
        if (!$originalTask) {
            return null;
        }

        $originalStatus = $originalTask->status;
        if ($originalStatus === $status) {
            return $originalTask;
        }

        $updatedTask = $this->taskRepository->updateForUser($id, $userId, ['status' => $status]);

        if ($updatedTask) {
            if ($status === 'Completed') {
                $this->activityLogService->log($userId, $updatedTask->id, 'Task Completed');
            } else {
                $this->activityLogService->log($userId, $updatedTask->id, 'Task Status Changed');
            }
        }

        return $updatedTask;
    }

    public function deleteTask(string $id, string $userId): bool
    {
        $deleted = $this->taskRepository->deleteForUser($id, $userId);
        if ($deleted) {
            // Log action (task_id can be null or string ID since task is deleted)
            $this->activityLogService->log($userId, $id, 'Task Deleted');
        }
        return $deleted;
    }
}
