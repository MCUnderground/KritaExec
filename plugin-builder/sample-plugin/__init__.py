from .loader import Loader

app = Krita.instance()
app.addExtension(Loader(app))