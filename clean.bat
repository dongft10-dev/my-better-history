@echo off
setlocal

echo Cleaning Vue Better History build artifacts...

:: Remove dist directory
if exist "dist" (
    echo Removing dist directory...
    rmdir /s /q "dist"
)

:: Remove node_modules directory (optional, for complete cleanup)
:: Uncomment the following lines if you want to also remove node_modules
:: if exist "node_modules" (
::     echo Removing node_modules directory...
::     rmdir /s /q "node_modules"
:: )

echo.
echo Cleanup completed!
echo.