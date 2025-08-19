@echo off
setlocal EnableDelayedExpansion

set "SOURCE_DIR=%~1"

rem === Source dir is where this script is located ===
set "SOURCE_DIR=%~dp0"
if "%SOURCE_DIR:~-1%"=="\" set "SOURCE_DIR=%SOURCE_DIR:~0,-1%"

rem === Auto-detect plugin name from folder name ===
for %%A in ("%SOURCE_DIR%") do set "PLUGIN_NAME=%%~nA"

rem === Destination base dir (param or default) ===
if "%~1"=="" (
    set "DEST_BASE_DIR=%SOURCE_DIR%\bin"
) else (
    set "DEST_BASE_DIR=%~1"
)


set "DEST_DIR=%DEST_BASE_DIR%\plugins\%PLUGIN_NAME%"
set "DESKTOP_FILE=%DEST_BASE_DIR%\plugins\%PLUGIN_NAME%.desktop"
set "ACTION_FILE=%DEST_BASE_DIR%\actions\%PLUGIN_NAME%.action"


mkdir "%DEST_BASE_DIR%\plugins" 2>nul
mkdir "%DEST_BASE_DIR%\actions" 2>nul

echo Using destination folder: %DEST_BASE_DIR%

set "PLUGIN_DISPLAY_NAME="
set "PLUGIN_SHORTCUT="
set "PLUGIN_DESCRIPTION="

for /f "usebackq delims=" %%l in ("%SOURCE_DIR%\config.json") do (
    set "line=%%l"
    set "line=!line:"=!"   :: remove quotes

    echo !line! | findstr /i /c:"name:" >nul && (
        for /f "tokens=2 delims=:" %%a in ("!line!") do (
            set "PLUGIN_DISPLAY_NAME=%%a"
            set "PLUGIN_DISPLAY_NAME=!PLUGIN_DISPLAY_NAME:~1!"
            set "PLUGIN_DISPLAY_NAME=!PLUGIN_DISPLAY_NAME:~0,-1!"
        )
    )

    echo !line! | findstr /i /c:"shortcut:" >nul && (
        for /f "tokens=2 delims=:" %%a in ("!line!") do (
            set "PLUGIN_SHORTCUT=%%a"
            set "PLUGIN_SHORTCUT=!PLUGIN_SHORTCUT:~1!"
            set "PLUGIN_SHORTCUT=!PLUGIN_SHORTCUT:~0,-1!"
        )
    )

    echo !line! | findstr /i /c:"description:" >nul && (
        for /f "tokens=2 delims=:" %%a in ("!line!") do (
            set "PLUGIN_DESCRIPTION=%%a"
            set "PLUGIN_DESCRIPTION=!PLUGIN_DESCRIPTION:~1!"
            set "PLUGIN_DESCRIPTION=!PLUGIN_DESCRIPTION:~0,-1!"
        )
    )
)

set "PLUGIN_ACTION_NAME=%PLUGIN_DISPLAY_NAME: =_%"
for /f %%A in ('cmd /c echo %PLUGIN_ACTION_NAME% ^| powershell -nologo -noprofile -command "[Console]::In.ReadToEnd().ToLower()"') do set "PLUGIN_ACTION_NAME=%%A"



rem === Copy plugin files ===
echo Copying Python files...
mkdir "%DEST_DIR%" 2>nul
for %%F in ("%SOURCE_DIR%\*.py") do copy /Y "%%F" "%DEST_DIR%" >nul

rem === Copy config file ===
echo Copying .json files...
for %%F in ("%SOURCE_DIR%\config.json") do copy /Y "%%F" "%DEST_DIR%" >nul

rem === Copy read me file ===
echo Copying .json files...
for %%F in ("%SOURCE_DIR%\README.md") do copy /Y "%%F" "%DEST_DIR%" >nul


rem === Create .desktop file ===
echo Generating desktop file at: %DESKTOP_FILE%
(
echo [Desktop Entry]
echo Type=Service
echo ServiceTypes=Krita/PythonPlugin
echo X-KDE-Library=%PLUGIN_NAME%
echo X-Python-2-Compatible=false
echo X-Krita-Manual=README.md
echo Name=%PLUGIN_NAME%
echo Comment=%PLUGIN_DESCRIPTION%
) > "%DESKTOP_FILE%"

rem === Generate .action file ===
echo Generating action file at: %ACTION_FILE%
> "%ACTION_FILE%" (
    echo ^<ActionCollection version="2" name="Scripts"^>
    echo     ^<Actions category="Scripts"^>
    echo         ^<text^>Whiterook^</text^>
    echo.
    echo         ^<Action name="%PLUGIN_ACTION_NAME%"^>
    echo             ^<icon^>^</icon^>
    echo             ^<text^>%PLUGIN_DISPLAY_NAME%^</text^>
    echo             ^<whatsThis^>^</whatsThis^>
    echo             ^<toolTip^>^</toolTip^>
    echo             ^<iconText^>^</iconText^>
    echo             ^<activationFlags^>0^</activationFlags^>
    echo             ^<activationConditions^>0^</activationConditions^>
    echo             ^<shortcut^>%PLUGIN_SHORTCUT%^</shortcut^>
    echo             ^<isCheckable^>false^</isCheckable^>
    echo             ^<statusTip^>^</statusTip^>
    echo         ^</Action^>
    echo     ^</Actions^>
    echo ^</ActionCollection^>
)




echo Done.
endlocal
pause