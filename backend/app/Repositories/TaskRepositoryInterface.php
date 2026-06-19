<?php

namespace App\Repositories;

use App\Models\Task;

interface TaskRepositoryInterface
{
    public function getPaginatedForUser(
        string $userId,
        array $filters = [],
        ?string $search = null,
        string $sortBy = 'created_at',
        string $sortOrder = 'desc',
        int $perPage = 10
    );

    public function getAllForUser(string $userId);

    public function getByIdForUser(string $id, string $userId): ?Task;

    public function createForUser(string $userId, array $data): Task;

    public function updateForUser(string $id, string $userId, array $data): ?Task;

    public function deleteForUser(string $id, string $userId): bool;
}
