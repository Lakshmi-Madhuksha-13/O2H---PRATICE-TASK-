<?php

namespace App\Repositories;

use App\Models\Task;

class TaskRepository implements TaskRepositoryInterface
{
    public function getPaginatedForUser(
        string $userId,
        array $filters = [],
        ?string $search = null,
        string $sortBy = 'created_at',
        string $sortOrder = 'desc',
        int $perPage = 10
    ) {
        $query = Task::where('user_id', $userId);

        // Apply filters
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        // Apply search
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        // Map common request sort keys to actual database columns if needed
        $allowedSortFields = ['created_at', 'updated_at', 'due_date', 'title', 'status', 'priority'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, strtolower($sortOrder) === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($perPage);
    }

    public function getAllForUser(string $userId)
    {
        return Task::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
    }

    public function getByIdForUser(string $id, string $userId): ?Task
    {
        return Task::where('_id', $id)->where('user_id', $userId)->first();
    }

    public function createForUser(string $userId, array $data): Task
    {
        $data['user_id'] = $userId;
        return Task::create($data);
    }

    public function updateForUser(string $id, string $userId, array $data): ?Task
    {
        $task = $this->getByIdForUser($id, $userId);
        if ($task) {
            $task->update($data);
            return $task->fresh();
        }
        return null;
    }

    public function deleteForUser(string $id, string $userId): bool
    {
        $task = $this->getByIdForUser($id, $userId);
        if ($task) {
            return $task->delete();
        }
        return false;
    }
}
