<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Task;
use App\Models\ActivityLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Clean existing collections to avoid duplicates
        try {
            User::truncate();
            Task::truncate();
            ActivityLog::truncate();
        } catch (\Exception $e) {
            // Ignore if collections don't exist yet
        }

        // Create Demo User
        $user = User::create([
            'name' => 'Demo User',
            'email' => 'demo@taskora.com',
            'password' => Hash::make('Demo@123'),
        ]);

        $tasksData = [
            // Completed Tasks
            [
                'title' => 'Design Taskora Logo',
                'description' => 'Create a brand new logo and identity system for Taskora, focusing on clean slate and violet colors.',
                'status' => 'Completed',
                'priority' => 'Medium',
                'tags' => ['Design', 'Branding'],
                'due_date' => Carbon::now()->subDays(5),
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'title' => 'Configure Laravel Sanitization',
                'description' => 'Install and configure middleware to prevent XSS attacks and sanitize user inputs.',
                'status' => 'Completed',
                'priority' => 'High',
                'tags' => ['Backend', 'Security'],
                'due_date' => Carbon::now()->subDays(2),
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => 'Setup Railway Hosting',
                'description' => 'Configure PostgreSQL/MongoDB environment variables and deploy Laravel skeleton build.',
                'status' => 'Completed',
                'priority' => 'High',
                'tags' => ['DevOps', 'Deployment'],
                'due_date' => Carbon::now()->subDays(3),
                'created_at' => Carbon::now()->subDays(6),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'title' => 'Create Git Repository',
                'description' => 'Set up empty GitHub repository and push the base folder structure.',
                'status' => 'Completed',
                'priority' => 'Low',
                'tags' => ['DevOps'],
                'due_date' => Carbon::now()->subDays(7),
                'created_at' => Carbon::now()->subDays(8),
                'updated_at' => Carbon::now()->subDays(7),
            ],
            [
                'title' => 'Draft API Documentation Schema',
                'description' => 'Outline route parameters, request payloads, and expected response payloads for Swagger/Postman.',
                'status' => 'Completed',
                'priority' => 'Medium',
                'tags' => ['Backend', 'Documentation'],
                'due_date' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(4),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            
            // In Progress Tasks
            [
                'title' => 'Implement Kanban Board Drag-n-Drop',
                'description' => 'Integrate React DnD components with Vite frontend to enable smooth task column transitions.',
                'status' => 'In Progress',
                'priority' => 'High',
                'tags' => ['Frontend', 'Kanban'],
                'due_date' => Carbon::now()->addDays(3),
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Setup MongoDB Indexing',
                'description' => 'Define composite, unique, and text search indexes in the tasks collection for fast search.',
                'status' => 'In Progress',
                'priority' => 'Medium',
                'tags' => ['Backend', 'Database'],
                'due_date' => Carbon::now()->addDays(5),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Create Sidebar Navigation Component',
                'description' => 'Build a responsive Sidebar using lucide icons, supporting collapsed state on tablet views.',
                'status' => 'In Progress',
                'priority' => 'Low',
                'tags' => ['Frontend', 'UI'],
                'due_date' => Carbon::now()->addDays(6),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Add Dark Mode/Light Mode Theme Toggle',
                'description' => 'Create a ThemeContext to switch CSS variables between slate-light and slate-dark themes.',
                'status' => 'In Progress',
                'priority' => 'Medium',
                'tags' => ['Frontend', 'UI'],
                'due_date' => Carbon::now()->addDays(2),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Write Backend PHPUnit Integration Tests',
                'description' => 'Cover tasks CRUD actions, profile management, and authentication validation rules in Laravel.',
                'status' => 'In Progress',
                'priority' => 'High',
                'tags' => ['Backend', 'Testing'],
                'due_date' => Carbon::now()->addDays(1),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now(),
            ],

            // Overdue Tasks (Status != Completed, Due Date < Now)
            [
                'title' => 'Fix Auth Token Expiry Bug',
                'description' => 'Sanctum tokens expire too quickly on mobile networks. Need to adjust token lifetime configs.',
                'status' => 'Pending',
                'priority' => 'High',
                'tags' => ['Backend', 'Bug'],
                'due_date' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(4),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => 'Audit Database Security Policy',
                'description' => 'Verify MongoDB Atlas firewall rules, IP whitelists, and database user IAM roles.',
                'status' => 'Pending',
                'priority' => 'High',
                'tags' => ['Backend', 'Security'],
                'due_date' => Carbon::now()->subDays(2),
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'title' => 'Align Tasks Grid Alignment on Safari',
                'description' => 'Grid cards wrap incorrectly on Safari mobile. Fix CSS flexbox properties.',
                'status' => 'In Progress',
                'priority' => 'Low',
                'tags' => ['Frontend', 'Bug'],
                'due_date' => Carbon::now()->subDays(3),
                'created_at' => Carbon::now()->subDays(6),
                'updated_at' => Carbon::now()->subDays(3),
            ],

            // Pending Tasks
            [
                'title' => 'Add Excel/CSV Task Export Feature',
                'description' => 'Allow users to download their current tasks list as an Excel sheet or CSV file.',
                'status' => 'Pending',
                'priority' => 'Low',
                'tags' => ['Backend', 'Feature'],
                'due_date' => Carbon::now()->addDays(10),
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'title' => 'Integrate Toast Notifications',
                'description' => 'Add a notification provider on frontend to prompt successful task creation/completion/deletion.',
                'status' => 'Pending',
                'priority' => 'Medium',
                'tags' => ['Frontend', 'UI'],
                'due_date' => Carbon::now()->addDays(4),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => 'Setup Vitest Environment',
                'description' => 'Configure Vitest and jsdom wrapper inside Vite frontend for rapid component logic tests.',
                'status' => 'Pending',
                'priority' => 'Medium',
                'tags' => ['Frontend', 'Testing'],
                'due_date' => Carbon::now()->addDays(7),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Create Password Reset Email Template',
                'description' => 'Design clean email markup to send link when users trigger Forgot Password.',
                'status' => 'Pending',
                'priority' => 'Low',
                'tags' => ['Design', 'Backend'],
                'due_date' => Carbon::now()->addDays(8),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Add Task Priority Color Badges',
                'description' => 'Create a visual badge component to display Low (gray), Medium (orange), and High (red) colors.',
                'status' => 'Pending',
                'priority' => 'Low',
                'tags' => ['Frontend', 'UI'],
                'due_date' => Carbon::now()->addDays(12),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Implement Search Debouncing',
                'description' => 'Add custom hook `useDebounce` to trigger API fetch 300ms after user finishes typing.',
                'status' => 'Pending',
                'priority' => 'Medium',
                'tags' => ['Frontend', 'Performance'],
                'due_date' => Carbon::now()->addDays(5),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Integrate ShadCN Dialog Modal',
                'description' => 'Ensure clicking task cards opens a gorgeous, readable detail dialog to edit titles, tags and dates.',
                'status' => 'Pending',
                'priority' => 'High',
                'tags' => ['Frontend', 'UI'],
                'due_date' => Carbon::now()->addDays(4),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($tasksData as $tData) {
            $tData['user_id'] = $user->id;
            $task = Task::create($tData);

            // Log actions for this task
            ActivityLog::create([
                'user_id' => $user->id,
                'task_id' => $task->id,
                'action' => 'Task Created',
                'created_at' => $tData['created_at'],
            ]);

            if ($tData['status'] !== 'Pending') {
                ActivityLog::create([
                    'user_id' => $user->id,
                    'task_id' => $task->id,
                    'action' => $tData['status'] === 'Completed' ? 'Task Completed' : 'Task Status Changed',
                    'created_at' => $tData['updated_at'],
                ]);
            }
        }
    }
}
