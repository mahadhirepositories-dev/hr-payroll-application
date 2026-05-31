<?php
require __DIR__.'/backend/vendor/autoload.php';
$app = require_once __DIR__.'/backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h2>Starting Installation...</h2>";

try {
    echo "<b>Optimizing and Clearing Caches...</b><br><pre>";
    \Illuminate\Support\Facades\Artisan::call('optimize:clear');
    echo \Illuminate\Support\Facades\Artisan::output();
    echo "</pre>";
    
    echo "<b>Running Migrations & Seeders...</b><br><pre>";
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    echo \Illuminate\Support\Facades\Artisan::output();
    
    \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
    echo \Illuminate\Support\Facades\Artisan::output();
    echo "</pre>";

    echo "<b>Linking Storage...</b><br><pre>";
    $link = __DIR__.'/backend/public/storage';
    if (is_dir($link) && !is_link($link)) {
        rmdir($link); // clear if accidental physical folder exists
    }
    \Illuminate\Support\Facades\Artisan::call('storage:link');
    echo \Illuminate\Support\Facades\Artisan::output();
    echo "</pre>";

    echo "<h3 style='color:green'>Installation Complete!</h3>";
} catch (\Exception $e) {
    echo "<h3 style='color:red'>Error: " . $e->getMessage() . "</h3>";
}
