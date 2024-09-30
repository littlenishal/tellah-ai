import sys
import os
sys.path.append('src')

from models.project import Project
from models.task import Task
from services.ai_manager import AIManager
from database.db_config import (
    init_db, create_project, create_task, update_task, get_all_tasks,
    get_all_projects, get_tasks_by_project_id, get_project_by_id
)

def create_new_project():
    ai_manager = AIManager()

    # Get project prompt from the console
    project_prompt = input("Enter a brief description of your project: ")

    # Use AI to generate a project name
    project_name = ai_manager.generate_project_name(project_prompt)
    print(f"\nCreated new project: {project_name}")

    # Create a new project
    project = create_project(Project(name=project_name, description=project_prompt))

    # Generate tasks using AI
    print("\nGenerating tasks using AI:")
    task_descriptions = ai_manager.generate_tasks(project_prompt)

    # Create tasks in the database
    created_tasks = []
    for task_description in task_descriptions:
        try:
            estimated_time = ai_manager.estimate_task_time(task_description)
            task = create_task(Task(description=task_description, project_id=project.id, estimated_time=estimated_time))
            created_tasks.append(task)
            print(f"- Generated task: {task.description} (ID: {task.id}, Estimated time: {task.estimated_time:.2f} hours)")
        except Exception as e:
            print(f"Error creating task '{task_description}': {str(e)}")

    if created_tasks:
        # Get AI suggestion for the next task
        next_task = ai_manager.suggest_next_task([task.description for task in created_tasks])
        print(f"\nAI-suggested next task: {next_task}")

        # Update the suggested task status
        for task in created_tasks:
            if task.description == next_task:
                update_task(task.id, status="In Progress")
                print(f"Updated task '{next_task}' status to: In Progress")
                break

        # Generate and print AI-powered project report
        print("\nGenerating AI-powered Project Report:")
        report = ai_manager.generate_project_report(project, created_tasks)
        print(report)
    else:
        print("\nNo tasks were successfully created. Please try again.")

def list_projects():
    projects = get_all_projects()
    print("\n=== Projects ===")
    for project in projects:
        print(f"ID: {project.id}, Name: {project.name}")

def list_tasks_for_project():
    project_id = int(input("Enter the project ID: "))
    tasks = get_tasks_by_project_id(project_id)
    project = get_project_by_id(project_id)
    print(f"\n=== Tasks for Project: {project.name} ===")
    for task in tasks:
        print(f"ID: {task.id}, Description: {task.description}, Status: {task.status}")

def update_task_with_ai():
    ai_manager = AIManager()

    # Get user input
    project_name = input("Enter the project name: ")
    task_description = input("Enter the task description: ")
    user_prompt = input("Enter your prompt to update the task status: ")

    # Find the project
    projects = get_all_projects()
    project = next((p for p in projects if p.name.lower() == project_name.lower()), None)
    if not project:
        print("Project not found.")
        return

    # Find the task
    tasks = get_tasks_by_project_id(project.id)
    task = next((t for t in tasks if t.description.lower() == task_description.lower()), None)
    if not task:
        print("Task not found in the specified project.")
        return

    # Generate new status using AI
    new_status = ai_manager.update_task_status_from_prompt(user_prompt, project.name, task.description, task.status)

    # Update the task
    update_task(task.id, status=new_status)
    print(f"Task '{task.description}' updated. New status: {new_status}")

def main():
    print("=== TellahAI: AI-Enhanced Project Management Tool ===")

    # Check if the API key is set
    if 'GOOGLE_AI_API_KEY' not in os.environ:
        print("Error: GOOGLE_AI_API_KEY environment variable is not set.")
        print("Please set your Google AI API key and try again.")
        return

    # Initialize the database
    init_db()

    while True:
        print("\n1. Create new project")
        print("2. List projects")
        print("3. List tasks for a project")
        print("4. Update task with AI")
        print("5. Exit")

        choice = input("Enter your choice (1-5): ")

        try:
            if choice == '1':
                create_new_project()
            elif choice == '2':
                list_projects()
            elif choice == '3':
                list_tasks_for_project()
            elif choice == '4':
                update_task_with_ai()
            elif choice == '5':
                print("Thank you for using TellahAI. Goodbye!")
                break
            else:
                print("Invalid choice. Please try again.")
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            print("Please check your input and try again.")

if __name__ == "__main__":
    main()