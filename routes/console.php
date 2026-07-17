<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Sinkronisasi artikel jurnal dari OJS ke cache Portal, setiap jam.
// Jalankan manual: php artisan journals:sync
// Simulasi lokal:  php artisan schedule:work
Schedule::command('journals:sync')->hourly();
