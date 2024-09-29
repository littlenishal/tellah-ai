from database.db_config import init_db, create_project, create_task, get_project, get_tasks, update_task_status

def main():
    # Initialize the database
    init_db()

    # Create a sample project
    project_id = create_project("E-commerce Platform Revamp", "Revamping our e-commerce platform with new features and optimizations")
    print(f"Created new project with ID: {project_id}")

    # Create some sample tasks
    task1_id = create_task(project_id, "Implement user authentication", "Improve user authentication system", 20.5)
    task2_id = create_task(project_id, "Optimize product search", "Implement efficient search algorithms", 15.0)

    # Retrieve and display project information
    project = get_project(project_id)
    print(f"Project: {project['name']}")
    print(f"Description: {project['description']}")

    # Retrieve and display tasks
    tasks = get_tasks(project_id)
    print("Tasks:")
    for task in tasks:
        print(f"- {task['title']} (Status: {task['status']})")

    # Update a task status
    update_task_status(task1_id, "In Progress")
    print("Updated task 1 status to 'In Progress'")

if __name__ == "__main__":
    main()