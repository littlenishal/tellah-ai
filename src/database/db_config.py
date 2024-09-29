import sqlite3
import os

DATABASE_NAME = 'tellahAI.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Read SQL schema
    with open('schema.sql', 'r') as sql_file:
        sql_script = sql_file.read()

    # Execute SQL commands
    cursor.executescript(sql_script)

    conn.commit()
    conn.close()

def create_project(name, description):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO projects (name, description) VALUES (?, ?)',
                   (name, description))
    conn.commit()
    project_id = cursor.lastrowid
    conn.close()
    return project_id

def create_task(project_id, title, description, estimated_hours):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO tasks (project_id, title, description, estimated_hours) VALUES (?, ?, ?, ?)',
                   (project_id, title, description, estimated_hours))
    conn.commit()
    task_id = cursor.lastrowid
    conn.close()
    return task_id

def get_project(project_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
    project = cursor.fetchone()
    conn.close()
    return project

def get_tasks(project_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tasks WHERE project_id = ?', (project_id,))
    tasks = cursor.fetchall()
    conn.close()
    return tasks

def update_task_status(task_id, status):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE tasks SET status = ? WHERE id = ?', (status, task_id))
    conn.commit()
    conn.close()

# Add more CRUD operations as needed