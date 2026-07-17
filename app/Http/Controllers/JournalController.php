<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\JournalArticleCache;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index()
    {
        return Inertia::render('journals/index', [
            'journals' => Journal::withCount('articles')->get(),
        ]);
    }

    public function show(Journal $journal)
    {
        $articles = JournalArticleCache::where('journal_id', $journal->id)
            ->latest('published_date')
            ->paginate(15);

        return Inertia::render('journals/show', [
            'journal' => $journal,
            'articles' => $articles,
        ]);
    }
}
