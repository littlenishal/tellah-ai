import sqlite3
from models.project import Project
from models.task import Task

DATABASE_NAME = 'tellahAI.db'

def init_db():
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()

    # Create tables if they don't exist
    c.execute('''CREATE TABLE IF NOT EXISTS projects
                 (id INTEGER PRIMARY KEY, name TEXT, description TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS tasks
                 (id INTEGER PRIMARY KEY, description TEXT, status TEXT, 
                  estimated_time REAL, project_id INTEGER,
                  FOREIGN KEY(project_id) REFERENCES projects(id))''')
    conn.commit()
    conn.close()

def create_project(project):
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO projects (name, description) VALUES (?, ?)", 
              (project.name, project.description))
    project_id = c.lastrowid
    conn.commit()
    conn.close()
    return Project(id=project_id, name=project.name, description=project.description)

def create_task(task):
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO tasks (description, status, estimated_time, project_id) VALUES (?, ?, ?, ?)", 
              (task.description, task.status, task.estimated_time, task.project_id))
    task_id = c.lastrowid
    conn.commit()
    conn.close()
    return Task(id=task_id, description=task.description, status=task.status, 
                estimated_time=task.estimated_time, project_id=task.project_id)

def update_task(task_id, status=None, estimated_time=None):
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    if status is not None:
        c.execute("UPDATE tasks SET status = ? WHERE id = ?", (status, task_id))
    if estimated_time is not None:
        c.execute("UPDATE tasks SET estimated_time = ? WHERE id = ?", (estimated_time, task_id))
    conn.commit()
    conn.close()

def get_all_tasks():
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("SELECT id, description, status, estimated_time, project_id FROM tasks")
    tasks = [Task(id=row[0], description=row[1], status=row[2], estimated_time=row[3], project_id=row[4]) for row in c.fetchall()]
    conn.close()
    return tasks

def get_project_by_id(project_id):
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    project_data = c.fetchone()
    conn.close()
    if project_data:
        return Project(id=project_data[0], name=project_data[1], description=project_data[2])
    return None

def get_all_projects():
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("SELECT id, name, description FROM projects")
    projects = [Project(id=row[0], name=row[1], description=row[2]) for row in c.fetchall()]
    conn.close()
    return projects

def get_tasks_by_project_id(project_id):
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("SELECT id, description, status, estimated_time, project_id FROM tasks WHERE project_id = ?", (project_id,))
    tasks = [Task(id=row[0], description=row[1], status=row[2], estimated_time=row[3], project_id=row[4]) for row in c.fetchall()]
    conn.close()
    return tasks