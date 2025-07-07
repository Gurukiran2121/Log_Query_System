# Log Sift: A Log Ingestion & Querying System

A full-stack web application designed to ingest, store, and query log data. It features a Node.js backend that provides a filterable API for logs stored in a JSON file, and a dynamic React frontend for searching and visualizing the log data.

## Key Features

- **Log Ingestion:** A `POST` endpoint to receive and persist new log entries with Zod validation.
- **Dynamic Querying:** A `GET` endpoint with a robust, chainable filtering system.
- **Interactive UI:** A real-time frontend that allows users to filter logs by full-text search, multiple log levels, multiple Span IDs, Resource ID, and timestamp range.
- **Optimized & Secure:** The backend includes security best practices like CORS and Helmet, and the UI uses debouncing for a smooth user experience.
- **Dockerized:** The backend is fully containerized with separate configurations for development and production environments.

## Tech Stack

#### **Backend**

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Validation:** Zod
- **Containerization:** Docker

#### **Frontend**

- **Library:** React
- **Language:** TypeScript
- **UI Components:** Ant Design
- **State Management:** Zustand
- **API Client:** Axios

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v18 or later)
- npm (or yarn)
- Docker and Docker Compose

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Backend Setup:**

    - Navigate to the server directory: `cd server`
    - Install dependencies: `npm install`
    - Create a `.env` file in the `/server` directory and add the following content:
      ```env
      PORT=8080
      NODE_ENV="development"
      ```

3.  **Frontend Setup:**

    - Navigate to the client directory from the root: `cd client`
    - Install dependencies: `npm install`
    - Create a `.env` file in the `/client` directory and add the following content:
      ```env
      VITE_SERVER_BASE_URL=http://localhost:8080
      VITE_API_VERSION=/api/v1
      ```

## Running the Application

There are two ways to run the application: manually with Node.js or using Docker Compose for the server.

### Method 1: Running Manually

You will need two separate terminals for this method.

**Terminal 1: Start the Backend Server**

```bash
# From the root directory
cd server
npm run dev
```

The server will be running on `http://localhost:8080`.

**Terminal 2: Start the Frontend React App**

```bash
# From the root directory
cd client
npm run dev
```

The client will be available at `http://localhost:5173` (or another port specified by Vite).

### Method 2: Running with Docker Compose (Recommended for Backend)

This is the easiest way to run the backend server. You will still need to run the frontend manually.

**Terminal 1: Start the Backend Server with Docker**

```bash
# From the /server directory
docker-compose up dev
```

The server will be running on `http://localhost:8080`.

**Terminal 2: Start the Frontend React App**

```bash
# From the root directory
cd client
npm run dev
```
