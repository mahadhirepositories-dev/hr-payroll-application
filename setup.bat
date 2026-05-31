@echo off
echo ============================================
echo   HR Payroll System - Setup
echo ============================================
echo.

echo Step 1: Installing PHP dependencies (backend)...
cd /d "%~dp0backend"
if not exist "vendor" (
    php ..\..\composer.phar install --no-interaction 2>nul || echo [WARNING] Composer not found. Run: composer install
) else (
    echo Vendor exists, skipping...
)

echo.
echo Step 2: Create .env file...
if not exist ".env" (
    copy .env.example .env >nul
    echo Created .env - please edit database credentials
) else (
    echo .env already exists
)

echo.
echo Step 3: Generating app key...
php artisan key:generate --force 2>nul || echo [WARNING] Run: php artisan key:generate

echo.
echo Step 4: Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install

echo.
echo ============================================
echo   Setup complete!
echo.
echo   Next steps:
echo   1. Edit backend\.env with your database settings
echo   2. Run: cd backend ^&^& php artisan migrate --seed
echo   3. Run: cd backend ^&^& php artisan storage:link
echo   4. Run: cd backend ^&^& php artisan serve
echo   5. In another terminal: cd frontend ^&^& ng serve
echo.
echo   Login: admin@hr.com / password
echo ============================================
pause
