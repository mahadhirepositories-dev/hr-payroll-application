# build-and-package.ps1
$DeployDir = "C:\Users\rdine\Desktop\HR Application\zopapro-working"
If (Test-Path $DeployDir) { Remove-Item -Recurse -Force $DeployDir }
New-Item -ItemType Directory -Path $DeployDir | Out-Null
New-Item -ItemType Directory -Path "$DeployDir\backend" | Out-Null
New-Item -ItemType Directory -Path "$DeployDir\public" | Out-Null

Write-Host "Copying backend..."
Copy-Item -Path "C:\Users\rdine\Desktop\HR Application\backend\*" -Destination "$DeployDir\backend\" -Recurse -Exclude ".git", ".env", "node_modules" -Force

Write-Host "Copying frontend build..."
Copy-Item -Path "C:\Users\rdine\Desktop\HR Application\frontend\dist\frontend\browser\*" -Destination "$DeployDir\public\" -Recurse -Force

Write-Host "Creating patches and routing..."
# Root .htaccess
$RootHtaccess = "<IfModule mod_rewrite.c>`n    RewriteEngine On`n    RewriteRule ^(?!public/)(.*)$ public/$1 [L,NC]`n</IfModule>"
Set-Content -Path "$DeployDir\.htaccess" -Value $RootHtaccess

# Public .htaccess for Angular routing
$PublicHtaccess = "<IfModule mod_rewrite.c>`n    RewriteEngine On`n    RewriteBase /`n    RewriteCond %{REQUEST_FILENAME} !-f`n    RewriteCond %{REQUEST_FILENAME} !-d`n    RewriteRule ^(.*)$ index.php [L]`n</IfModule>"
Set-Content -Path "$DeployDir\public\.htaccess" -Value $PublicHtaccess

# Public index.php (The PHP Router)
$IndexPhp = <<<'PHP'
<?php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if (strpos($uri, '/api/') === 0 || strpos($uri, '/sanctum/') === 0) {
    require __DIR__.'/../backend/public/index.php';
} elseif (strpos($uri, '/storage/') === 0) {
    $relativePath = substr($uri, 9);
    $path1 = __DIR__.'/../backend/public/storage/' . $relativePath;
    $path2 = __DIR__.'/../backend/storage/app/public/' . $relativePath;
    $filePath = false;
    if (file_exists($path1) && is_file($path1)) $filePath = $path1;
    elseif (file_exists($path2) && is_file($path2)) $filePath = $path2;
    
    if ($filePath) {
        $mime = mime_content_type($filePath) ?: 'application/octet-stream';
        header("Content-Type: $mime");
        header("Content-Length: " . filesize($filePath));
        readfile($filePath);
        exit;
    }
    http_response_code(404);
    echo "File not found.";
} else {
    if (file_exists(__DIR__.'/index.html')) {
        require __DIR__.'/index.html';
    } else {
        echo "Angular index.html not found!";
    }
}
PHP
Set-Content -Path "$DeployDir\public\index.php" -Value $IndexPhp

Write-Host "Building zip archive..."
$ZipPath = "C:\Users\rdine\Desktop\zopapro-working.zip"
If (Test-Path $ZipPath) { Remove-Item -Force $ZipPath }
cd $DeployDir
tar -a -c -f $ZipPath *
cd ..
Remove-Item -Recurse -Force $DeployDir
Write-Host "Zipping complete!"
