<?php

namespace App\Console\Commands;

use App\Models\Journal;
use App\Models\JournalArticleCache;
use App\Services\OjsClient;
use Illuminate\Console\Command;

class SyncJournalArticles extends Command
{
    protected $signature   = 'journals:sync';
    protected $description = 'Sinkronisasi artikel published dari semua jurnal OJS ke cache Portal';

    public function handle(OjsClient $client): int
    {
        $journals = Journal::all();

        if ($journals->isEmpty()) {
            $this->warn('Tidak ada data jurnal di tabel journals. Jalankan seeder JournalSeeder dulu.');

            return self::FAILURE;
        }

        foreach ($journals as $journal) {
            $this->info("Sinkronisasi: {$journal->name} ({$journal->ojs_base_url})");

            $submissions = $client->getPublishedSubmissions($journal->ojs_base_url);

            if (empty($submissions)) {
                $this->warn('  Tidak ada data diterima dari OJS untuk jurnal ini.');
                $this->warn('  Pastikan OJS sudah punya artikel published dan OJS_API_TOKEN sudah diisi di .env');
                continue;
            }

            $count = 0;

            foreach ($submissions as $submission) {
                $publications = $submission['publications'] ?? [];
                $publication  = ! empty($publications)
                    ? $publications[array_key_last($publications)]
                    : null;

                if (! $publication) {
                    continue;
                }

                $title = $this->extractLocalized($publication['fullTitle'] ?? $publication['title'] ?? []);

                $authors = collect($publication['authors'] ?? [])
                    ->map(function ($a) {
                        $given  = is_array($a['givenName'] ?? null)
                            ? ($a['givenName']['en_US'] ?? $a['givenName']['id_ID'] ?? array_values($a['givenName'])[0] ?? '')
                            : ($a['givenName'] ?? '');
                        $family = is_array($a['familyName'] ?? null)
                            ? ($a['familyName']['en_US'] ?? $a['familyName']['id_ID'] ?? array_values($a['familyName'])[0] ?? '')
                            : ($a['familyName'] ?? '');

                        return trim("{$given} {$family}");
                    })
                    ->filter()
                    ->implode(', ');

                $abstract = $this->extractLocalized($publication['abstract'] ?? []);

                JournalArticleCache::updateOrCreate(
                    [
                        'journal_id'     => $journal->id,
                        'ojs_article_id' => (string) $submission['id'],
                    ],
                    [
                        'title'          => $title ?: 'Tanpa judul',
                        'authors'        => $authors ?: '-',
                        'abstract'       => $abstract,
                        'issue_volume'   => isset($publication['issueId']) ? (string) $publication['issueId'] : null,
                        'doi'            => $publication['pub-id::doi'] ?? null,
                        'pdf_url'        => rtrim($journal->ojs_base_url, '/') . '/article/view/' . $submission['id'],
                        'published_date' => $publication['datePublished'] ?? null,
                        'synced_at'      => now(),
                    ]
                );

                $count++;
            }

            $this->info("  Berhasil sync {$count} artikel.");
        }

        return self::SUCCESS;
    }

    /**
     * Field OJS sering berbentuk objek multi-bahasa, contoh: {"en_US": "Judul", "id_ID": "..."}.
     * Ambil locale yang tersedia sebagai fallback sederhana.
     */
    protected function extractLocalized(array|string $field): ?string
    {
        if (is_string($field)) {
            return $field ?: null;
        }

        if (! is_array($field) || empty($field)) {
            return null;
        }

        return $field['en_US']
            ?? $field['id_ID']
            ?? (array_values($field)[0] ?? null);
    }
}
