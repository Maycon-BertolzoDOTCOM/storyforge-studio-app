@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
set "ENTRY=%SCRIPT_DIR%app\node_modules\@open-design\packaged\dist\webui-launcher.mjs"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found. Please install Node 24 and try again: https://nodejs.org 1>&2
  exit /b 1
)
for /f "tokens=1 delims=." %%v in ('node -p "process.versions.node"') do set "MAJOR=%%v"
if %MAJOR% LSS 24 (
  echo Node 24+ is required. Please upgrade and try again. 1>&2
  exit /b 1
)
set "OD_RESOURCE_ROOT=%SCRIPT_DIR%app\resources\open-design"
rem Install root holding the launcher scripts + webui.config(.example).json, so
rem the launcher discovers/scaffolds config independent of the caller's cwd.
set "OD_WEBUI_HOME=%SCRIPT_DIR%"
node "%ENTRY%" %*
endlocal
