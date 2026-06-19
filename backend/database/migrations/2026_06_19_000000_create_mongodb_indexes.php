<?php

use Illuminate\Database\Migrations\Migration;
use Laravel\Sanctum\Sanctum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        try {
            // Setup User Index
            Illuminate\Support\Facades\Schema::connection('mongodb')->table('users', function ($collection) {
                $collection->unique('email');
            });

            // Setup Tasks Indexes
            Illuminate\Support\Facades\Schema::connection('mongodb')->table('tasks', function ($collection) {
                $collection->index('user_id');
                $collection->index('status');
                $collection->index('priority');
                $collection->index('due_date');
                $collection->index(['title' => 'text', 'description' => 'text'], 'tasks_text_index');
            });

            // Setup Activity Logs Indexes
            Illuminate\Support\Facades\Schema::connection('mongodb')->table('activity_logs', function ($collection) {
                $collection->index('user_id');
                $collection->index('task_id');
            });
        } catch (\Exception $e) {
            // Ignore index setup issues if database not connected yet
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            Illuminate\Support\Facades\Schema::connection('mongodb')->table('users', function ($collection) {
                $collection->dropUnique('email');
            });

            Illuminate\Support\Facades\Schema::connection('mongodb')->table('tasks', function ($collection) {
                $collection->dropIndex(['user_id']);
                $collection->dropIndex(['status']);
                $collection->dropIndex(['priority']);
                $collection->dropIndex(['due_date']);
                $collection->dropIndex('tasks_text_index');
            });

            Illuminate\Support\Facades\Schema::connection('mongodb')->table('activity_logs', function ($collection) {
                $collection->dropIndex(['user_id']);
                $collection->dropIndex(['task_id']);
            });
        } catch (\Exception $e) {
            // Ignore
        }
    }
};
