# Mini Task Board

A simple full-stack task management application built using Next.js, TypeScript, React, and PostgreSQL.

## Features

* View all tasks
* Create a new task with title and status
* Update task status
* Delete tasks
* Validation for empty task titles
* Loading and error handling
* PostgreSQL database integration
* Simple and responsive user interface

## Tech Stack

* Next.js
* TypeScript
* React
* Next.js Route Handlers
* PostgreSQL
* Node.js `pg` package
* CSS

## Project Structure

The application follows a simple structure:

```text
Frontend
   ↓
Next.js API Routes
   ↓
Task Service
   ↓
PostgreSQL
```

I used Next.js Route Handlers for the API instead of creating a separate Express backend. Since this is a small application, keeping the frontend and backend in the same Next.js project makes the project easier to manage and run.

## API Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/tasks`     | Get all tasks     |
| POST   | `/api/tasks`     | Create a new task |
| PATCH  | `/api/tasks/:id` | Update a task     |
| DELETE | `/api/tasks/:id` | Delete a task     |

## Database Setup

The project uses PostgreSQL.

Create a database named:

```text
task_board
```

Then run the SQL files:

```text
database/schema.sql
database/seed.sql
```

The `schema.sql` file creates the required table, and `seed.sql` adds some sample tasks.

## Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_board
```

Replace `YOUR_PASSWORD` with your local PostgreSQL password.

## Run the Project

First, install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```


## SQL Safety

The application uses parameterized SQL queries for database operations instead of directly inserting user input into SQL queries.

## Database Note

The assessment mentioned MySQL as the database. I implemented the database layer using PostgreSQL because PostgreSQL was available in my local development environment due to some issue in my mysql.

The application functionality remains the same, including creating, reading, updating, and deleting tasks.

