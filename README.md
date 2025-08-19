# KritaExec

**KritaExec** for VS Code\
Supercharge your Krita Python plugin development with **zero-config
IntelliSense** and an integrated **plugin scaffolding system**.\
This extension provides syntax highlighting, snippets, and **full
auto-completion** powered by the **bundled Krita Python API stubs**
shipped with Krita --- plus a ready-made plugin builder for hot-reload
development.

------------------------------------------------------------------------

## ✨ Features

-   📦 **Bundled Krita API Stubs**\
    Uses the official Python API from your installed Krita program for
    complete IntelliSense, type hints, and docstrings in VS Code.

-   ⚡ **Auto-Enable IntelliSense**\
    Automatically detects when you open a Python file and injects the
    Krita API stub path into `python.analysis.extraPaths`.

-   🛠 **Manual Command Support**\
    Quickly enable Krita IntelliSense on demand via\
    `KritaExec: Enable Krita API IntelliSense`.

-   🧩 **Plugin Scaffolding**\
    Create a new Krita plugin project instantly with\
    `KritaExec: Create Krita Plugin`.

-   🔄 **Hot-Reloadable Builds**\
    Build and reload your plugin in Krita with one command --- no
    restarts needed.

------------------------------------------------------------------------

## 🛠 Commands

  ----------------------------------------------------------------------------------------
  Command                                      Description
  -------------------------------------------- -------------------------------------------
  `KritaExec: Enable Krita API IntelliSense`   Injects the Krita API stub path into
                                               workspace settings.

  `KritaExec: Create Krita Plugin`             Scaffolds a Krita plugin project with a
                                               ready-to-build structure.
  ----------------------------------------------------------------------------------------

### 🔑 Keybindings

  Keybinding     Action
  -------------- -------------------------------
  `Ctrl+Alt+K`   Enable Krita API IntelliSense
  `Ctrl+Alt+G`   Create a new Krita plugin

------------------------------------------------------------------------

## 🚀 Workflow

### 1. Create a Plugin

Run **`KritaExec: Create Krita Plugin`** (default shortcut:
`Ctrl+Alt+G`).\
This generates a new folder in your workspace with a sample Krita plugin
scaffold, including a pre-configured **builder script**.

------------------------------------------------------------------------

### 2. Build Your Plugin

Inside your plugin folder, use the builder script:

``` powershell
.\Runner\builder.cmd
```

-   Builds into a local `bin/` folder.\
-   Each build is **hot-reloadable** inside Krita.

------------------------------------------------------------------------

### 3. Deploy Directly to Krita

To build straight into Krita's plugin directory (on Windows):

``` powershell
.\Runner\builder.cmd "%APPDATA%\krita"
```

> Works similarly on Linux and macOS --- just pass Krita's resource
> folder as argument.

------------------------------------------------------------------------

### 4. Config-Driven Setup

Your `config.json` defines the plugin's:

-   **Display Name**\
-   **Shortcut**\
-   **Description**

The builder reads this automatically and generates:

-   `.desktop` file\
-   `.action` file

So each build is always in sync with your plugin metadata.

------------------------------------------------------------------------

## ⚙ How It Works

1.  **Stub Path Injection**\
    On activation, KritaExec locates bundled stubs (from `krita-lang`)
    and injects them into workspace settings.

2.  **Scaffolding**\
    A `sample-plugin` template is copied and renamed, with placeholders
    like `SamplePlugin` replaced by your chosen name.

3.  **Builder**\
    The included `builder.cmd` script copies `.py`, `config.json`, and
    metadata files into the chosen destination (`bin/` or Krita's plugin
    folder).

------------------------------------------------------------------------

## 📦 Requirements

-   **Krita** installed on your system.\
-   **VS Code 1.60.0+**\
-   **Python extension (Pylance)** for IntelliSense.

------------------------------------------------------------------------

## 🧪 Troubleshooting

-   ❌ **No IntelliSense**: Ensure your workspace is a folder (not just
    a single file).\
-   ⚠ **Wrong stub path**: Run
    `KritaExec: Enable Krita API IntelliSense`.\
-   🔄 **Plugin not reloading**: Verify you are building into Krita's
    active resource folder.

------------------------------------------------------------------------

## 📄 License

MIT

------------------------------------------------------------------------

## 📷 Icon

![KritaExec Icon](images/icon.png)
