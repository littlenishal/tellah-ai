import random
from datetime import datetime, timedelta

class Task:
    def __init__(self, title, description, status="To Do", story_points=None):
        self.id = random.randint(1000, 9999)
        self.title = title
        self.description = description
        self.status = status
        self.story_points = story_points
        self.created_at = datetime.now()
        self.updated_at = datetime.now()