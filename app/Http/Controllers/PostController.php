<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with('category')
            ->where('status', 'published')
            ->when($request->category, fn ($q, $cat) => $q->where('category_id', $cat))
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'categories' => PostCategory::orderBy('name')->get(),
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(Post $post)
    {
        return Inertia::render('posts/show', ['post' => $post->load('category', 'author')]);
    }
}
