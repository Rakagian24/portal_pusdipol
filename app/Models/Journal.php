<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    protected $fillable = ['name', 'ojs_base_url', 'logo', 'description'];

    public function articles()
    {
        return $this->hasMany(JournalArticleCache::class, 'journal_id');
    }
}
