import google.generativeai as genai
import os
import json
import re

class AIManager:
    def __init__(self):
        # Set up the API key
        genai.configure(api_key=os.environ['GOOGLE_AI_API_KEY'])

        # Set up the model
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_project_name(self, project_description):
        prompt = f"Generate a concise and catchy project name based on this description: {project_description}"
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def generate_tasks(self, project_description):
        prompt = f"""
        Based on the following project description, generate a list of 5-7 high-level tasks that would be necessary to complete the project. 
        Return the tasks as a JSON array of strings.

        Project description: {project_description}
        """
        response = self.model.generate_content(prompt)
        print("Raw API response:")
        print(response.text)
        try:
            # Strip any markdown code block indicators
            json_str = re.sub(r'```json\n?|\n?```', '', response.text).strip()
            tasks = json.loads(json_str)
            if not isinstance(tasks, list):
                raise ValueError("API did not return a list of tasks")
            return tasks
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {str(e)}")
            print("API response was not valid JSON. Falling back to text parsing.")
            # Attempt to parse the text response
            tasks = [line.strip() for line in response.text.split('\n') if line.strip() and not line.strip().startswith('```')]
            return tasks[:7]  # Limit to 7 tasks maximum
        except Exception as e:
            print(f"Error parsing tasks: {str(e)}")
            return ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"]  # Fallback tasks

    # ... (rest of the methods remain the same)

    def estimate_task_time(self, task_description):
        prompt = f"Estimate the time in hours it would take to complete this task: {task_description}. Return only a number."
        response = self.model.generate_content(prompt)
        try:
            return float(response.text.strip())
        except ValueError:
            print(f"Could not parse time estimate: {response.text}")
            return 1  # Default to 1 hour if we can't parse the response

    def suggest_next_task(self, tasks):
        task_list = "\n".join([f"- {task}" for task in tasks])
        prompt = f"""
        Given the following list of tasks for a project, suggest which task should be done next. Consider dependencies, complexity, and impact. Return only the name of the task.

        Tasks:
        {task_list}
        """
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def generate_project_report(self, project, tasks):
        completed_tasks = sum(1 for task in tasks if task.status == "Completed")
        progress = (completed_tasks / len(tasks)) * 100 if tasks else 0
        task_list = "\n".join([f"- {task.description} (Status: {task.status})" for task in tasks])

        prompt = f"""
        Generate a brief project report based on the following information:

        Project Name: {project.name}
        Project Description: {project.description}
        Total Tasks: {len(tasks)}
        Completed Tasks: {completed_tasks}
        Progress: {progress:.2f}%

        Task List:
        {task_list}

        Provide a summary of the project status, highlight key achievements, and suggest next steps.
        """
        response = self.model.generate_content(prompt)
        return response.text.strip()