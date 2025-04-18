# Todo Application

A simple Todo application with a Flask API backend and vanilla JavaScript frontend.

## Project Structure

```
├── backend/                # Flask API server
│   ├── app.py              # Main Flask application
│   ├── Dockerfile          # Backend container definition
│   └── requirements.txt    # Python dependencies
├── frontend/               # Vanilla JS frontend
│   ├── index.html          # HTML markup
│   ├── script.js           # JavaScript application logic
│   ├── styles.css          # CSS styling
│   └── Dockerfile          # Frontend container definition
└── docker-compose.yml      # Multi-container definition
```

## Features

- Create, read, update, and delete todo items
- Mark todos as complete or incomplete
- Filter todos by all, active, or completed status
- Clear all completed todos at once
- Responsive design that works on mobile and desktop
- Containerized application for easy deployment

## Prerequisites

- Docker and Docker Compose installed on your system

## Running the Application

1. Clone the repository to your local machine
2. Navigate to the project directory
3. Build and start the containers:

```bash
docker-compose up -d
```

4. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000/api/todos

## Development

### Running the Backend Locally

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Running the Frontend Locally

You can use any simple HTTP server. For example, with Python:

```bash
cd frontend
python -m http.server 8080
```

Then access the application at http://localhost:8080

## API Endpoints

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## License

This project is licensed under the terms of the LICENSE file included in this repository.