<?php

namespace Database\Seeders;

use App\Models\BookCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Kriminologi',
            'Hukum Kepolisian',
            'Kebijakan Publik & Keamanan',
            'Sosiologi Hukum',
            'Hak Asasi Manusia',
        ];

        foreach ($categories as $name) {
            BookCategory::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }
    }
}
