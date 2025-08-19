import importlib.util
import sys
import os
import inspect

from .config import PluginConfig

from krita import Extension, Krita
from PyQt5.QtGui import QKeySequence
from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import QMenu


class Loader(Extension):
    def __init__(self, parent):
        super().__init__(parent)
        self.config = PluginConfig()

    def setup(self):
        Krita.instance().notifier().windowCreated.connect(self.on_window_created)
        pass

    def on_window_created(self):
        self.register(Krita.instance().activeWindow())

    def register(self, window):
        qwin = window.qwindow()
        menubar = qwin.menuBar()

        parts = [p.strip() for p in (self.config.location or "").split("/") if p.strip()]

        current_menu = menubar
        for idx, part in enumerate(parts):
            is_main_menu = (idx == 0)
            is_submenu  = (idx > 0)

            direct_menus = current_menu.findChildren(QMenu, options=Qt.FindDirectChildrenOnly)
            match = next((m for m in direct_menus if m.title().strip().lower() == part.lower()), None)

            if match is None:
                match = current_menu.addMenu(part)
            current_menu = match


        target_menu = current_menu if isinstance(current_menu, QMenu) else None
        if target_menu is None:
            return

        action_id = self.config.name.lower().replace(" ", "_")

        already = next((a for a in target_menu.actions() if a.text() == self.config.name), None)
        if already is None:
            action = window.createAction(action_id, self.config.name, self.config.location)
            if self.config.shortcut:
                action.setShortcut(QKeySequence(self.config.shortcut))
            action.triggered.connect(self.run_script)
            target_menu.addAction(action)

            target_menu = current_menu if isinstance(current_menu, QMenu) else None
            if target_menu is None:
                return

            action_id = self.config.name.lower().replace(" ", "_")
            already = next((a for a in target_menu.actions() if a.text() == self.config.name), None)
            if already is None:
                action = window.createAction(action_id, self.config.name, self.config.location)
                if self.config.shortcut:
                    action.setShortcut(QKeySequence(self.config.shortcut))
                action.triggered.connect(self.run_script)
                target_menu.addAction(action)


    def createActions(self, window):
        return


    def run_script(self):
        plugin_dir = os.path.dirname(__file__)
        script_name = "main"
        py_path = os.path.join(plugin_dir, f"{script_name}.py")
        pyc_path = os.path.join(plugin_dir, f"{script_name}.pyc")

        if os.path.exists(py_path):
            script_path = py_path
        elif os.path.exists(pyc_path):
            script_path = pyc_path
        else:
            print("Neither main.py nor main.pyc found.")
            return

        if plugin_dir not in sys.path:
            sys.path.insert(0, plugin_dir)

        folder_name = os.path.basename(plugin_dir)

        spec = importlib.util.spec_from_file_location(script_name, script_path)
        mod = importlib.util.module_from_spec(spec)
        sys.modules[script_name] = mod
        spec.loader.exec_module(mod)

        # Find a class with the same name as the folder
        plugin_class = None
        for name, obj in inspect.getmembers(mod, inspect.isclass):
            if name == folder_name:
                plugin_class = obj
                break

        if plugin_class:
            plugin_instance = plugin_class(config=self.config)
            plugin_instance.run()
        else:
            print(f"No plugin class matching '{folder_name}' found in {script_name}.")
