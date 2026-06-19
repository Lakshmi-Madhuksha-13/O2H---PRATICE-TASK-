<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Task;
use App\Models\ActivityLog;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        try {
            User::truncate();
            Task::truncate();
            ActivityLog::truncate();
        } catch (\Exception $e) {
            // Ignore
        }

        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);
    }

    public function test_unauthenticated_user_cannot_access_tasks()
    {
        $response = $this->getJson('/api/tasks');
        $response->assertStatus(401);
    }

    public function test_user_can_create_task()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/tasks', [
            'title' => 'New Task',
            'description' => 'Task description',
            'priority' => 'High',
            'status' => 'Pending',
            'tags' => ['Tag1', 'Tag2'],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('task.title', 'New Task')
            ->assertJsonPath('task.priority', 'High');

        $this->assertDatabaseHas('tasks', [
            'title' => 'New Task',
            'user_id' => $this->user->id,
        ]);

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'Task Created',
        ]);
    }

    public function test_user_can_list_own_tasks()
    {
        Sanctum::actingAs($this->user);

        Task::create([
            'title' => 'Task 1',
            'user_id' => $this->user->id,
            'priority' => 'Medium',
            'status' => 'Pending',
        ]);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_user_can_update_task()
    {
        Sanctum::actingAs($this->user);

        $task = Task::create([
            'title' => 'Original Task',
            'user_id' => $this->user->id,
            'priority' => 'Low',
            'status' => 'Pending',
        ]);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => 'Updated Task',
            'priority' => 'High',
            'status' => 'In Progress',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('task.title', 'Updated Task')
            ->assertJsonPath('task.priority', 'High');

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'Task Status Changed',
        ]);
    }

    public function test_user_can_patch_task_status()
    {
        Sanctum::actingAs($this->user);

        $task = Task::create([
            'title' => 'Original Task',
            'user_id' => $this->user->id,
            'priority' => 'Low',
            'status' => 'Pending',
        ]);

        $response = $this->patchJson("/api/tasks/{$task->id}/status", [
            'status' => 'Completed',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('task.status', 'Completed');

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'Task Completed',
        ]);
    }

    public function test_user_can_delete_task()
    {
        Sanctum::actingAs($this->user);

        $task = Task::create([
            'title' => 'Task to Delete',
            'user_id' => $this->user->id,
            'priority' => 'Low',
            'status' => 'Pending',
        ]);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('tasks', [
            '_id' => $task->id,
        ]);

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'Task Deleted',
        ]);
    }
}
