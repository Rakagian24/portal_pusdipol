<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Post;
use App\Models\JournalArticleCache;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q', '');

        $books = [];
        $posts = [];
        $articles = [];

        if (!empty($query)) {
            $books = Book::with('category')
                ->where('title', 'like', "%{$query}%")
                ->orWhere('author', 'like', "%{$query}%")
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            $posts = Post::with('category')
                ->where('title', 'like', "%{$query}%")
                ->orWhere('content', 'like', "%{$query}%")
                ->orderBy('published_at', 'desc')
                ->limit(10)
                ->get();

            $articles = JournalArticleCache::with('journal')
                ->where('title', 'like', "%{$query}%")
                ->orWhere('authors', 'like', "%{$query}%")
                ->orderBy('published_date', 'desc')
                ->limit(10)
                ->get();
        }

        return Inertia::render('search/index', [
            'query' => $query,
            'results' => [
                'books' => $books,
                'posts' => $posts,
                'articles' => $articles,
            ],
            'totalResults' => count($books) + count($posts) + count($articles),
        ]);
    }
}
