<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule daily sales report to run every day at 8:00 PM
Schedule::command('sales:daily-report')
    ->dailyAt('20:00')
    ->timezone('Europe/Paris')
    ->description('Send daily sales report to administrators');
