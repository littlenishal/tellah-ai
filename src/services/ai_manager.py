import random
from datetime import datetime, timedelta

from models.task import Task
from models.project import Project

class TellahAI:
    def __init__(self):
        self.projects = []

    def create_project(self, name):
        project = Project(name)
        self.projects.append(project)
        return project

    def generate_task(self, project, context):
        # Simulate AI task generation based on context
        title = f"Implement {context} feature"
        description = f"Create the {context} functionality as discussed in the planning meeting."
        story_points = random.randint(1, 8)
        task = Task(title, description, story_points=story_points)
        project.add_task(task)
        return task

    def estimate_task(self, task):
        # Simulate AI estimation based on task description and historical data
        base_time = task.story_points * 4  # 4 hours per story point as a base
        variance = random.uniform(0.8, 1.2)  # Add some variance
        return base_time * variance

    def suggest_next_task(self, project):
        # Simulate AI suggesting the next most important task
        return random.choice(project.tasks)

    def generate_report(self, project):
        total_tasks = len(project.tasks)
        completed_tasks = sum(1 for task in project.tasks if task.status == "Done")
        return f"Project: {project.name}\nTotal Tasks: {total_tasks}\nCompleted Tasks: {completed_tasks}\nProgress: {completed_tasks/total_tasks*100:.2f}%"