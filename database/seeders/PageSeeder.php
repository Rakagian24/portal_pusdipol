<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        $pages = [
            [
                'slug' => 'tentang-kami',
                'title' => 'Tentang Pusat Studi Kepolisian',
                'content' => '<p>Pusat Studi Kepolisian Universitas Langlangbuana adalah unit riset yang fokus pada isu kepolisian, hukum, dan kriminologi.</p>',
            ],
            [
                'slug' => 'visi-misi',
                'title' => 'Visi & Misi',
                'content' => '<p>Visi: Menjadi pusat rujukan kajian kepolisian terkemuka di Indonesia.</p><p>Misi: Menghasilkan riset dan publikasi berkualitas di bidang kepolisian.</p>',
            ],
            [
                'slug' => 'kontak',
                'title' => 'Kontak',
                'content' => '<p>Email: pusatstudikepolisian@unla.ac.id</p>',
            ],
        ];

        foreach ($pages as $page) {
            Page::firstOrCreate(
                ['slug' => $page['slug']],
                [
                    'managed_by' => $admin?->id,
                    'title' => $page['title'],
                    'content' => $page['content'],
                ]
            );
        }
    }
}
