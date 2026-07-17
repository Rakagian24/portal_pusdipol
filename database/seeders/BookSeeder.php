<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\BookCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $categoryIds = BookCategory::pluck('id');

        $books = [
            'Reformasi Kepolisian di Era Digital',
            'Kriminologi Kontemporer: Teori dan Praktik',
            'Penegakan Hukum dan Hak Asasi Manusia',
            'Kebijakan Keamanan Publik di Indonesia',
            'Sosiologi Kejahatan Perkotaan',
            'Etika Profesi Kepolisian',
        ];

        foreach ($books as $title) {
            Book::firstOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'category_id' => $categoryIds->random(),
                    'created_by' => $admin?->id,
                    'title' => $title,
                    'author' => fake()->name(),
                    'isbn' => fake()->optional()->isbn13(),
                    'description' => fake()->paragraphs(3, true),
                    'cover_path' => null,
                    'file_path' => null,
                    'published_year' => fake()->numberBetween(2018, 2026),
                ]
            );
        }
    }
}
