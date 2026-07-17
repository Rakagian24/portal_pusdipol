<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\JournalArticleCache;
use App\Models\Post;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('home', [
            'latestBooks' => Book::latest()->take(4)->get(),
            'latestPosts' => Post::where('status', 'published')->latest('published_at')->take(3)->get(),
            'latestArticles' => JournalArticleCache::with('journal')->latest('published_date')->take(3)->get(),
        ]);
    }
}
