import random
from datetime import datetime, timedelta

class Project:
    def __init__(self, name):
        self.name = name
        self.tasks = []

    def add_task(self, task):
        self.tasks.append(task)

    def get_task_by_id(self, task_id):
        return next((task for task in self.tasks if task.id == task_id), None)