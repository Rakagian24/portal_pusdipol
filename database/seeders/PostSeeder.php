<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::where('role', 'editor')->first();
        $categoryIds = PostCategory::pluck('id');

        $titles = [
            'Seminar Nasional Kepolisian dan Masyarakat 2026',
            'Pusat Studi Kepolisian Luncurkan Jurnal Perdana',
            'Call for Papers: Edisi Khusus Reformasi Kepolisian',
            'Kunjungan Studi Banding ke Lembaga Riset Kepolisian',
            'Workshop Metodologi Penelitian Kriminologi',
        ];

        foreach ($titles as $title) {
            Post::firstOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'category_id' => $categoryIds->random(),
                    'author_id' => $author?->id,
                    'title' => $title,
                    'content' => fake()->paragraphs(5, true),
                    'thumbnail' => null,
                    'status' => 'published',
                    'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
                ]
            );
        }
    }
}
