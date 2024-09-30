import random
from datetime import datetime, timedelta

class Task:
    def __init__(self, description, project_id, id=None, status="Not Started", estimated_time=0):
        self.id = id
        self.description = description
        self.status = status
        self.estimated_time = estimated_time
        self.project_id = project_id