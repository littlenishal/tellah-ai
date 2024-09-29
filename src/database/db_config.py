import sqlite3
from models.project import Project
from models.task import Task

DATABASE_NAME = 'tellahAI.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS projects
                 (id INTEGER PRIMARY KEY, name TEXT, description TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS tasks
                 (id INTEGER PRIMARY KEY, project_id INTEGER, description TEXT, status TEXT,
                 FOREIGN KEY(project_id) REFERENCES projects(id))''')
    conn.commit()
    conn.close()

def create_project(name, description):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO projects (name, description) VALUES (?, ?)", (name, description))
    project_id = c.lastrowid
    conn.commit()
    conn.close()
    return get_project(project_id)

def get_project(project_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    project_data = c.fetchone()
    conn.close()
    if project_data:
        return Project(project_data['id'], project_data['name'], project_data['description'])
    return None

def create_task(project_id, description, status="Not Started"):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO tasks (project_id, description, status) VALUES (?, ?, ?)",
              (project_id, description, status))
    task_id = c.lastrowid
    conn.commit()
    conn.close()
    return get_task(task_id)

def get_task(task_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    task_data = c.fetchone()
    conn.close()
    if task_data:
        return Task(task_data['id'], task_data['project_id'], task_data['description'], task_data['status'])
    return None

def update_task(task_id, status):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("UPDATE tasks SET status = ? WHERE id = ?", (status, task_id))
    conn.commit()
    conn.close()
    return get_task(task_id)

# Call this function to ensure tables are created
create_tables()