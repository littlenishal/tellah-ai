import random
from datetime import datetime, timedelta

class Project:
    def __init__(self, name, description, id=None):
        self.id = id
        self.name = name
        self.description = description

    def __str__(self):
        return f"Project(id={self.id}, name='{self.name}', description='{self.description}')"