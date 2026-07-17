<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OjsClient
{
    protected string $apiToken;

    public function __construct()
    {
        $this->apiToken = config('services.ojs.api_token', '');
    }

    /**
     * Ambil daftar submission yang sudah published dari satu jurnal OJS.
     *
     * @param string $baseUrl contoh: http://localhost/ojs/index.php/kepolisian
     * @param int    $count   jumlah artikel yang diambil per request
     * @return array
     */
    public function getPublishedSubmissions(string $baseUrl, int $count = 20): array
    {
        $url = rtrim($baseUrl, '/') . '/api/v1/submissions';

        $response = Http::withToken($this->apiToken)
            ->timeout(15)
            ->get($url, [
                'status'         => 3, // STATUS_PUBLISHED di OJS
                'count'          => $count,
                'orderBy'        => 'datePublished',
                'orderDirection' => 'DESC',
            ]);

        if (! $response->successful()) {
            // Fallback: beberapa konfigurasi server (CGI/shared hosting) tidak meneruskan
            // header Authorization dengan benar, sehingga perlu fallback ke query param.
            $response = Http::timeout(15)->get($url, [
                'apiToken'       => $this->apiToken,
                'status'         => 3,
                'count'          => $count,
                'orderBy'        => 'datePublished',
                'orderDirection' => 'DESC',
            ]);
        }

        if (! $response->successful()) {
            Log::warning('Gagal fetch submissions dari OJS', [
                'url'    => $url,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return [];
        }

        return $response->json('items') ?? [];
    }
}
