<?php

namespace Database\Seeders;

use App\Models\Journal;
use Illuminate\Database\Seeder;

class JournalSeeder extends Seeder
{
    public function run(): void
    {
        Journal::firstOrCreate(
            ['name' => 'Jurnal Studi Kepolisian'],
            [
                'ojs_base_url' => 'http://localhost/ojs/index.php/jsk', // ganti dengan path jurnal OJS asli
                'logo' => null,
                'description' => 'Jurnal ilmiah Pusat Studi Kepolisian Universitas Langlangbuana, membahas isu kepolisian, hukum, dan kriminologi.',
            ]
        );
    }
}
