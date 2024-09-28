# src/main.py

from models.task import Task
from models.project import Project
from services.ai_manager import TellahAI

def preview_mvp():
    print("=== TellahAI: AI-Enhanced Project Management Tool MVP Preview ===\n")

    # Initialize TellahAI
    tellah = TellahAI()

    # Create a new project
    project = tellah.create_project("E-commerce Platform Revamp")
    print(f"Created new project: {project.name}")

    # Generate tasks using AI
    contexts = [
        "user authentication improvements",
        "product recommendation engine",
        "checkout process optimization",
        "mobile responsiveness",
        "inventory management system"
    ]
    print("\nGenerating tasks using AI:")
    for context in contexts:
        task = tellah.generate_task(project, context)
        print(f"- Generated task: {task.title} (ID: {task.id})")

    # Estimate time for a specific task
    task_to_estimate = project.tasks[2]  # Choosing the third task
    estimated_time = tellah.estimate_task(task_to_estimate)
    print(f"\nAI Estimation for '{task_to_estimate.title}':")
    print(f"Estimated time: {estimated_time:.2f} hours")

    # Suggest next task
    next_task = tellah.suggest_next_task(project)
    print(f"\nAI-suggested next task: {next_task.title}")

    # Update task status
    next_task.status = "In Progress"
    print(f"Updated task '{next_task.title}' status to: {next_task.status}")

    # Generate project report
    print("\nGenerating AI-powered Project Report:")
    report = tellah.generate_report(project)
    print(report)

# Run the MVP preview

if __name__ == "__main__":
    preview_mvp()