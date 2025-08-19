from krita import *
 
class SamplePlugin:

    def __init__(self, config):
        self.config = config
        self.dialog = None

    def run(self):
        print("Entry point")
