<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'tasks';

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'tags',
        'due_date',
        'user_id',
    ];

    protected $casts = [
        'tags' => 'array',
        'due_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
