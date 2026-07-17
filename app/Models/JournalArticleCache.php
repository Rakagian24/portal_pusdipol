<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalArticleCache extends Model
{
    protected $table = 'journal_articles_cache';

    protected $fillable = [
        'journal_id', 'ojs_article_id', 'title', 'authors', 'abstract',
        'issue_volume', 'doi', 'pdf_url', 'published_date', 'synced_at',
    ];

    protected $casts = [
        'published_date' => 'date',
        'synced_at' => 'datetime',
    ];

    public function journal()
    {
        return $this->belongsTo(Journal::class, 'journal_id');
    }
}
