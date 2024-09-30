# TellahAI: AI-Enhanced Project Management Tool

TellahAI is an innovative AI-powered project management tool designed to streamline task management, provide intelligent insights, and boost productivity in software development projects. It leverages the Gemini API to generate project names, tasks, and provide AI-driven insights.

## Features

- AI-driven project name generation based on project description
- Automated task generation based on project context
- AI-powered time estimation for tasks
- Intelligent task prioritization
- Project progress reporting
- CRUD operations for projects and tasks
- SQLite database for data persistence

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- Google AI API key (for Gemini API access)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tellahAI.git
   cd tellahAI
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

5. Set up your Google AI API key:
   - On Unix/Linux/macOS:
     ```
     export GOOGLE_AI_API_KEY=your_api_key_here
     ```
   - On Windows:
     ```
     set GOOGLE_AI_API_KEY=your_api_key_here
     ```

## Project Structure

```
tellahAI/
│
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py
│   │   └── project.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── ai_manager.py
│   └── database/
│       ├── __init__.py
│       └── db_config.py
│
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   └── test_services.py
│
├── .gitignore
├── requirements.txt
└── README.md
```

## Usage

To run TellahAI:

```
python src/main.py
```

This will start the application, prompting you to enter a project description. TellahAI will then use AI to generate a project name, create tasks, estimate task durations, and provide a project report.

## Sample Output

```
=== TellahAI: AI-Enhanced Project Management Tool ===
Enter a brief description of your project: Create a web-based task management system

Created new project: TaskMaster Pro

Generating tasks using AI:
- Generated task: Design user interface (ID: 1, Estimated time: 8.50 hours)
- Generated task: Implement backend API (ID: 2, Estimated time: 16.75 hours)
- Generated task: Develop database schema (ID: 3, Estimated time: 4.25 hours)
- Generated task: Create user authentication system (ID: 4, Estimated time: 12.00 hours)
- Generated task: Implement task CRUD operations (ID: 5, Estimated time: 10.50 hours)

AI-suggested next task: Design user interface
Updated task 'Design user interface' status to: In Progress

Generating AI-powered Project Report:
Project: TaskMaster Pro
Description: Create a web-based task management system
Total Tasks: 5
Completed Tasks: 0
Progress: 0.00%

The project "TaskMaster Pro" has been successfully initiated with a clear goal of creating a web-based task management system. The AI has generated 5 high-level tasks that cover the essential aspects of the project, from design to implementation.

Key points:
1. The user interface design is prioritized as the first task, which is a good starting point for visualizing the project and gathering early feedback.
2. Backend development, including API and database work, forms a significant part of the project.
3. User authentication is included, which is crucial for a task management system.

Next steps:
1. Begin with the user interface design, focusing on user experience and intuitive task management.
2. Once the UI design is finalized, proceed with the backend API implementation to support the designed features.
3. Concurrently, work on the database schema to ensure it aligns with the API requirements.

The project is in its initial stages with 0% progress. Regular updates and task completions will help in moving the project forward. Remember to break down these high-level tasks into smaller, manageable subtasks as you progress.
```

## Contributing

Contributions to TellahAI are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project uses the Gemini API provided by Google for AI-powered features.
- Special thanks to the open-source community for their invaluable tools and libraries.