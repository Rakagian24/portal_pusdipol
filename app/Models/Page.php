<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['managed_by', 'slug', 'title', 'content'];

    public function manager()
    {
        return $this->belongsTo(User::class, 'managed_by');
    }
}
