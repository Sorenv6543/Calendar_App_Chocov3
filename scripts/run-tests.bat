@echo off
setlocal enabledelayedexpansion

REM Default options
set WATCH=false
set COVERAGE=false
set UPDATE=false
set FILTER=

REM Parse arguments
:parse_args
if "%~1"=="" goto run_tests
if "%~1"=="-w" (
    set WATCH=true
    shift
    goto parse_args
)
if "%~1"=="--watch" (
    set WATCH=true
    shift
    goto parse_args
)
if "%~1"=="-c" (
    set COVERAGE=true
    shift
    goto parse_args
)
if "%~1"=="--coverage" (
    set COVERAGE=true
    shift
    goto parse_args
)
if "%~1"=="-u" (
    set UPDATE=true
    shift
    goto parse_args
)
if "%~1"=="--update" (
    set UPDATE=true
    shift
    goto parse_args
)
if "%~1"=="-f" (
    set FILTER=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="--filter" (
    set FILTER=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="-h" (
    goto help
)
if "%~1"=="--help" (
    goto help
)
echo Unknown option: %~1
goto help

:help
echo Run Vitest tests for the Calendar app
echo.
echo Usage: run-tests.bat [OPTIONS]
echo.
echo Options:
echo   -w, --watch       Run tests in watch mode
echo   -c, --coverage    Run tests with coverage
echo   -u, --update      Update snapshots
echo   -f, --filter      Filter tests by name (e.g. FullCalendar)
echo   -h, --help        Show this help message
echo.
echo Examples:
echo   run-tests.bat                  # Run all tests once
echo   run-tests.bat -w               # Run tests in watch mode
echo   run-tests.bat -c               # Run tests with coverage
echo   run-tests.bat -f FullCalendar  # Run only FullCalendar tests
exit /b 0

:run_tests
REM Build the command
set CMD=npx vitest

if "%WATCH%"=="true" (
    set CMD=!CMD!
) else (
    set CMD=!CMD! run
)

if "%COVERAGE%"=="true" (
    set CMD=!CMD! --coverage
)

if "%UPDATE%"=="true" (
    set CMD=!CMD! -u
)

if not "%FILTER%"=="" (
    set CMD=!CMD! %FILTER%
)

REM Run the command
echo Running: !CMD!
!CMD!
exit /b 