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
    complete IntelliSense, type hints, and docstrings in VS Code.\
    *(The current bundled API is based on Krita **5.2**.)*

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
.\{PluginName}\builder.cmd
```

-   Builds into a local `bin/` folder.
-   Each build is **hot-reloadable** inside Krita.

------------------------------------------------------------------------

### 3. Deploy Directly to Krita

To build straight into Krita's plugin directory (on Windows):

``` powershell
.\{PluginName}\builder.cmd "%APPDATA%\krita"
```

> Works similarly on Linux and macOS --- just pass Krita's resource
> folder as argument.

------------------------------------------------------------------------

### 4. Config-Driven Setup

Your `config.json` defines the plugin's:

-   **Display Name**
-   **Shortcut**
-   **Description**

The builder reads this automatically and generates:

-   `.desktop` file
-   `.action` file

So each build is always in sync with your plugin metadata.

------------------------------------------------------------------------

### 5. Builder Description

# KritaExec Plugin  

### 5. Builder Description  

This plugin follows a simple but strict structure built around **three core files**:  

- `init.py` – handles plugin initialization.  
- `loader.py` – manages execution flow and hot reloading.  
- `main.py` – contains the main plugin logic.  

These files must always exist, while additional files can be added to extend functionality.  

#### Hot Reloading  

The **loader** executes the action on each run, always loading it directly from disk.  
This enables **hot reloading**, which is the only way to update scripts at runtime since Krita preloads all scripts on startup.  

#### Actions & Shortcuts  

Using the built-in **builder** and **config** system, the plugin can:  
- Automatically generate action files.  
- Add actions directly to Krita.  
- Assign **keyboard shortcuts** without manual setup.  

This makes it quick to expand the plugin with new scripts and commands.  

#### Menu Integration  

The loader can also create menu entries automatically. For example, if your script location is defined as:  
**KritaExec/FastScripts/**

- A new **KritaExec** menu will appear at the end of (or next to) Krita’s **Help** menu.  
- Inside it, a **FastScripts** submenu will be created.  
- Each script inside that folder will be listed there as a menu item.  

This ensures all plugin actions are neatly organized and easily accessible.  

#### Plugin Description  

The plugin description should be written in the **`README.md`** file.  
It will also be displayed inside Krita’s **Plugin Manager list**, so users can quickly understand the plugin’s purpose before enabling it.  


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

-   **Krita** installed on your system.
-   **VS Code 1.60.0+**
-   **Python extension (Pylance)** for IntelliSense.

------------------------------------------------------------------------

## 🧪 Troubleshooting

-   ❌ **No IntelliSense**: Ensure your workspace is a folder (not just
    a single file).
-   ⚠ **Wrong stub path**: Run
    `KritaExec: Enable Krita API IntelliSense`.
-   🔄 **Plugin not reloading**: Verify you are building into Krita's
    active resource folder.


------------------------------------------------------------------------

## 🙏 Acknowledgments

I would like to sincerely thank the [**Krita**](https://krita.org/) team  
and the [**KDE Community**](https://kde.org/) for creating and maintaining  
such an amazing piece of free and open-source software.  

Krita has empowered countless artists and developers worldwide, and without their work,  
projects like **KritaExec** would not be possible. 💙




## 📷 Icon

![KritaExec Icon](images/icon.png)
