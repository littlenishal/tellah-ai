from models.project import Project
from models.task import Task
from services.ai_manager import AIManager
from database.db_config import create_project, create_task, update_task

def main():
    print("=== TellahAI: AI-Enhanced Project Management Tool MVP Preview ===\n")

    # Initialize AI Manager
    ai_manager = AIManager()

    # Create a new project
    project_name = "E-commerce Platform Revamp"
    project_description = "Modernize our e-commerce platform with improved user experience and advanced features."
    project = create_project(project_name, project_description)
    print(f"Created new project: {project.name}\n")

    # Generate tasks using AI
    print("Generating tasks using AI:")
    ai_generated_tasks = ai_manager.generate_tasks(project.description)
    tasks = []
    for task_description in ai_generated_tasks:
        task = create_task(project.id, task_description)
        tasks.append(task)
        print(f"- Generated task: {task.description} (ID: {task.id})")
    print()

    if tasks:
        # Estimate time for a specific task
        sample_task = tasks[0]  # Choose the first task for this example
        estimated_time = ai_manager.estimate_task_time(sample_task.description)
        print(f"AI Estimation for '{sample_task.description}':")
        print(f"Estimated time: {estimated_time:.2f} hours\n")

        # Get AI suggestion for the next task
        next_task_description = ai_manager.suggest_next_task([task.description for task in tasks], [])
        next_task = next((task for task in tasks if task.description == next_task_description), None)
        if next_task:
            print(f"AI-suggested next task: {next_task.description}")

            # Update the suggested task status
            updated_task = update_task(next_task.id, status="In Progress")
            print(f"Updated task '{updated_task.description}' status to: {updated_task.status}\n")
        else:
            print("No next task suggested.\n")

        # Generate AI-powered project report
        report = ai_manager.generate_project_report(project.name, [task.description for task in tasks], [])
        print("Generating AI-powered Project Report:")
        print(report)
    else:
        print("No tasks were generated. Please check the AI response and try again.")

if __name__ == "__main__":
    main()