<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'user_id',
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class, 'post_id')->where('parent_comment_id', NULL);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
