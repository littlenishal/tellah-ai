import sys
import os
sys.path.append('src')

from models.project import Project
from models.task import Task
from services.ai_manager import AIManager
from database.db_config import init_db, create_project, create_task, update_task, get_all_tasks

def main():
    print("=== TellahAI: AI-Enhanced Project Management Tool ===")

    # Check if the API key is set
    if 'GOOGLE_AI_API_KEY' not in os.environ:
        print("Error: GOOGLE_AI_API_KEY environment variable is not set.")
        print("Please set your Google AI API key and try again.")
        return

    # Initialize the database
    init_db()

    # Create an instance of AIManager
    ai_manager = AIManager()

    try:
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

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        print("Please check your Google AI API key and internet connection, then try again.")

if __name__ == "__main__":
    main()