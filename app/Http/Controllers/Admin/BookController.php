<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::with('category')->latest()->paginate(10);

        return Inertia::render('admin/books/index', ['books' => $books]);
    }

    public function create()
    {
        return Inertia::render('admin/books/create', [
            'categories' => BookCategory::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'nullable|exists:book_categories,id',
            'isbn' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'published_year' => 'nullable|integer|min:1900|max:2100',
            'cover' => 'nullable|image|max:2048',
            'file' => 'nullable|file|mimes:pdf|max:20480',
        ]);

        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
        $data['created_by'] = $request->user()->id;

        if ($request->hasFile('cover')) {
            $data['cover_path'] = $request->file('cover')->store('books/covers', 'public');
        }
        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('books/files', 'public');
        }

        Book::create($data);

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil ditambahkan.');
    }

    public function edit(Book $book)
    {
        return Inertia::render('admin/books/edit', [
            'book' => $book,
            'categories' => BookCategory::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Book $book)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'nullable|exists:book_categories,id',
            'isbn' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'published_year' => 'nullable|integer|min:1900|max:2100',
            'cover' => 'nullable|image|max:2048',
            'file' => 'nullable|file|mimes:pdf|max:20480',
        ]);

        if ($request->hasFile('cover')) {
            $data['cover_path'] = $request->file('cover')->store('books/covers', 'public');
        }
        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('books/files', 'public');
        }

        $book->update($data);

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil diperbarui.');
    }

    public function destroy(Book $book)
    {
        $book->delete();

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil dihapus.');
    }
}
