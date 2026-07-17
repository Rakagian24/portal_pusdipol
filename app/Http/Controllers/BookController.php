<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = Book::with('category')
            ->when($request->category, fn ($q, $cat) => $q->where('category_id', $cat))
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('books/index', [
            'books' => $books,
            'categories' => BookCategory::orderBy('name')->get(),
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(Book $book)
    {
        return Inertia::render('books/show', ['book' => $book->load('category')]);
    }
}
