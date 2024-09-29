import os
import google.generativeai as genai
import ast

class AIManager:
    def __init__(self):
        api_key = os.getenv('GOOGLE_AI_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_AI_API_KEY environment variable is not set")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_tasks(self, project_description):
        prompt = f"Given the project description: '{project_description}', generate 5 key tasks for this project. Return the tasks as a Python list of strings, without any additional formatting or explanation."
        response = self.model.generate_content(prompt)

        # Extract the Python list from the response
        response_text = response.text.strip()
        if response_text.startswith('```python'):
            response_text = response_text.split('```python')[1]
        if response_text.endswith('```'):
            response_text = response_text.rsplit('```', 1)[0]

        try:
            tasks = ast.literal_eval(response_text.strip())
            if isinstance(tasks, list) and all(isinstance(item, str) for item in tasks):
                return tasks
            else:
                raise ValueError("Response is not a list of strings")
        except (SyntaxError, ValueError) as e:
            print(f"Error parsing AI response: {e}")
            print(f"Raw response: {response_text}")
            return []

    def estimate_task_time(self, task_description):
        prompt = f"Estimate the time in hours to complete this task: '{task_description}'. Return only a number."
        response = self.model.generate_content(prompt)
        try:
            return float(response.text.strip())
        except ValueError:
            print(f"Error parsing time estimate. Raw response: {response.text}")
            return 0

    def suggest_next_task(self, tasks, completed_tasks):
        incomplete_tasks = [task for task in tasks if task not in completed_tasks]
        if not incomplete_tasks:
            return None
        prompt = f"Given these incomplete tasks: {incomplete_tasks}, suggest the next task to work on. Return only the task name."
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def generate_project_report(self, project_name, tasks, completed_tasks):
        total_tasks = len(tasks)
        completed_count = len(completed_tasks)
        progress = (completed_count / total_tasks) * 100 if total_tasks > 0 else 0

        prompt = f"""
        Generate a brief project report for '{project_name}' with the following information:
        - Total Tasks: {total_tasks}
        - Completed Tasks: {completed_count}
        - Progress: {progress:.2f}%

        Provide a summary of the project status and any recommendations.
        """
        response = self.model.generate_content(prompt)
        return response.text.strip()