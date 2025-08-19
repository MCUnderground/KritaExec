# KritaExec

**KritaExec** for VS Code  
Supercharge your Krita Python plugin development with **zero‑config IntelliSense**.  
This extension provides syntax highlighting, snippets, and **full auto‑completion** powered by the **bundled Krita Python API stubs** shipped with the Krita program — no manual environment setup required.

---

## ✨ Features

- 📦 **Bundled Krita API Stubs**  
  Uses the official Python API from your installed Krita program for complete IntelliSense, type hints, and docstrings in VS Code.

- ⚡ **Auto‑Enable IntelliSense**  
  Automatically detects when you open a Python file and injects the Krita API stub path into `python.analysis.extraPaths` — seamless setup.

- 🛠 **Manual Command Support**  
  Quickly enable Krita IntelliSense on demand via `KritaExec: Enable Krita API IntelliSense`.

- ⌨ **Keybinding Convenience**  
  Run IntelliSense injection instantly with `Ctrl+Alt+K`.

- 🧩 **Plugin Scaffolding** *(Planned)*  
  Command to scaffold a Krita plugin project with a ready‑to‑build structure.

---

## 🛠 Commands

| Command | Description |
|--------|-------------|
| `KritaExec: Enable Krita API IntelliSense` | Injects the Krita API stub path into workspace settings. |
| `KritaExec: Create Krita Plugin` | Scaffolds a Krita plugin with automated builder. *(Future expansion)* |

### 🔑 Keybindings

| Keybinding | Action |
|-----------|--------|
| `Ctrl+Alt+K` | Enable Krita API IntelliSense |

---

## ⚙ How It Works

1. **Stub Path Injection**  
   On activation, KritaExec locates the bundled stubs shipped with your Krita installation (included with this extension in `krita-lang`) and injects them into your workspace settings.

2. **Auto Trigger**  
   The first time you open any Python file in a workspace, KritaExec automatically ensures the stubs are wired in — no commands or configuration needed.

3. **Idempotent Behavior**  
   Existing `python.analysis.extraPaths` settings are preserved; the stub path is added only if missing.

---

## 📦 Requirements

- **Krita** installed on your system (extension uses its bundled API stubs).
- **VS Code 1.60.0+**
- Python environment configured for your Krita plugin development.

---

## 🔧 Installation

1. Install Krita and ensure it’s working.
2. Install **KritaExec** from the VS Code Marketplace or clone from [GitHub](https://github.com/MCUnderground/kritaexec).
3. Reload VS Code.
4. Open a Krita plugin project and start editing `.py` files — IntelliSense should be instantly available.

---

## 🧪 Troubleshooting

- ❌ **No IntelliSense**: Ensure your workspace is a folder (not just a single file) and the Python extension (Pylance) is installed.
- ⚠ **Wrong stub path**: You can manually run `KritaExec: Enable Krita API IntelliSense` to re‑inject.
- 🔄 **Reload required**: Some settings changes require a window reload to take effect.

---

## 📄 License

MIT

---

## 📷 Icon

![KritaExec Icon](images/icon.png)
