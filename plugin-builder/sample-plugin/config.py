import os
import json

class PluginConfig:
    def __init__(self):
        plugin_dir = os.path.dirname(__file__)
        config_path = os.path.join(plugin_dir, "config.json")

        if not os.path.isfile(config_path):
            raise FileNotFoundError(f"config.json not found at {config_path}")

        with open(config_path, 'r', encoding='utf-8') as f:
            self._config = json.load(f)


    def get(self, key, default=None):
        return self._config.get(key, default)
    
    def get_path(self):
        plugin_dir = os.path.dirname(__file__)
        config_path = os.path.join(plugin_dir, "config.json")
        return config_path

    @property
    def name(self):
        return self._config.get("name", "Unnamed Plugin")

    @property
    def version(self):
        return self._config.get("version", "0.0.0")

    @property
    def shortcut(self):
        return self._config.get("shortcut", "")

    @property
    def location(self):
        return self._config.get("location", "tools/")
    
    @property
    def description(self):
        return self._config.get("description", "This plugin is made for Krita using KritaExec.")