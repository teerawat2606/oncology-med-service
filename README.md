# Oncology-Med-Service

Comprehensive medical service project focused on oncology. It includes both backend and frontend services.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Running the Project](#running-the-project)
  - [Development Environment](#development-environment)
  - [Production Environment](#production-environment)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Oncology-Med-Service is a robust platform designed to manage and streamline medical services related to oncology. It includes a backend service for managing medical data and a frontend for user interaction.

## Features

- Comprehensive patient management.
- Secure handling of medical records.
- Intuitive user interface for healthcare professionals.
- Scalability for large healthcare facilities.

## Project Structure

The project is organized into two main directories:

- **oncology-med-be**: Contains the backend services.
- **oncology-med-fe**: Contains the frontend application.

## Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Create a `.env` file based on the provided example:
   ```bash
   cp .env.example .env
   ```
3. Install the necessary dependencies using Yarn:
   ```bash
   yarn install
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Create a `.env` file based on the provided example:
   ```bash
   cp .env.example .env
   ```
3. Install the necessary dependencies using Yarn:
   ```bash
   yarn install
   ```

## Running the Project

### Development Environment

1. Navigate to the project root directory:
   ```bash
   cd ..
   ```
2. Run the development environment using Docker Compose:
   ```bash
   ./dev.sh up --build
   ```

### Production Environment

1. Navigate to the project root directory:
   ```bash
   cd ..
   ```
2. Run the production environment using Docker Compose:
   ```bash
   ./prod.sh up --build
   ```

## Configuration

Both backend and frontend require `.env` files for configuration. Ensure you set up these files as per the provided examples before running the project.

### Example Backend `.env` file

MYSQL_HOST="localhost"
MYSQL_PORT=3306
MYSQL_DATABASE="bdms"
MYSQL_USER="username"
MYSQL_PASSWORD="password"
MYSQL_ROOT_PASSWORD="rootpwd"

DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}"

DATABASE_SYNC=true

SESSION_SECRET="super_secured"
SESSION_MAX_AGE=3600000
SESSION_RESAVE=false
SESSION_SAVE_UNINITIALIZED=false

NEST_DEBUG=true

ORIGIN_URL=http://localhost:3000
PORT=3001

### Example Frontend `.env` file

REACT_APP_BACKEND_URL=http://localhost:3001

## Contact

For any inquiries or issues, please reach out:

- Project Maintainer: [Teerawat](mailto:teerawat.k@gmail.com)
- GitHub: [Project Repository](https://github.com/teerawat2606/oncology-med-service.git)
