<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ActivityLog extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'activity_logs';

    // Disable default timestamps, only created_at is needed as per the spec
    public $timestamps = false;

    protected $fillable = [
        'task_id',
        'user_id',
        'action',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
