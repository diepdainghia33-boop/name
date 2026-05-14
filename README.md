# 🌌 ChatID / Architect AI Platform

<<<<<<< HEAD
ChatID is a modern conversational AI platform that combines an intelligent chat interface with a powerful administration system (Dashboard). The project is designed to provide a smooth AI experience, supporting multiple models and deep integration into user workflows.

---

## 🚀 Project Introduction

ChatID is more than just a simple chat application. It is a complete ecosystem including:

- **Premium Chat Interface**: Supports Markdown, Code highlighting, file/image uploads, and real-time web search.
- **Dashboard System**: Monitor performance, usage traffic, and analyze user behavior with intuitive charts.
- **Flexible AI Management**: Allows configuration of multiple AI providers (Groq, Anthropic, ...) and easy API Key management.
- **Performance Optimization**: Uses Redis for caching to ensure the fastest response speeds.

---

## 🏗️ System Architecture

The system is built using a simple Microservices architecture, separating the interface, business logic, and AI processing.

### High-Level Architecture Diagram
=======
ChatID is a modern AI conversational platform that combines an intelligent chat interface with a powerful dashboard management system. The project is designed to deliver a seamless AI experience, support multiple AI models, and integrate deeply into users’ workflows.

---

# 🚀 Project Overview

ChatID is more than just a chat application. It is a complete AI ecosystem that includes:

- **Premium Chat Interface**  
  Supports Markdown, code highlighting, file/image uploads, and real-time web search.

- **Dashboard System**  
  Tracks performance, usage traffic, and user behavior analytics through interactive charts.

- **Flexible AI Management**  
  Allows configuration of multiple AI providers (Groq, Anthropic, etc.) and easy API key management.

- **Performance Optimization**  
  Uses Redis caching to ensure fast response times and better scalability.

---

# 🏗️ System Architecture

The platform follows a lightweight microservices architecture, separating the frontend, backend, and AI processing layers.

## High-Level Architecture
>>>>>>> a0de1c232751a7d7532c6aec6ccb9225d7e8e6c7

```mermaid
graph TD
    User((User)) -->|Access| FE[Frontend - React]
    FE -->|API Request| BE[Backend - Laravel]
    BE -->|Storage| DB[(MySQL)]
    BE -->|Caching| RD[(Redis)]
    BE -->|AI Task| AIS[AI Service - FastAPI]
    AIS -->|Processing| LLM[LLM Providers - Groq/Anthropic]
    AIS -->|OCR| TESS[Tesseract OCR]
🔧 Core Components
1. Frontend (React)
Built with React and modern UI libraries.
Handles application state, chat rendering, and dashboard visualizations.
Supports responsive and interactive user experiences.
2. Backend (Laravel)
Acts as the API Gateway.
Handles authentication, authorization, logging, and business logic.
Uses Laravel Sanctum for secure session/token management.
Coordinates communication between Frontend and AI Service.
3. AI Service (FastAPI)
High-performance Python service for AI-related tasks.
Integrates LangChain/LlamaIndex for LLM orchestration.
Supports OCR, web scraping, and file processing.
🔄 System Workflow
Chat Processing Flow
User sends a message from the Frontend.
Backend validates permissions and stores the message in MySQL.
Backend forwards the request to the AI Service.
AI Service processes the content:
OCR for images/files
Web search if needed
AI prompt orchestration
AI Service calls the LLM Provider API.
Response flows back through:
AI Service → Backend → Frontend
Frontend displays the generated response in real time.
Dashboard Analytics Flow
User activities are stored in the activity_logs table.
Backend calculates metrics such as:
Response Time
Success Rate
User Activity
API Usage
Data is returned to the Frontend and visualized using ApexCharts.
🛠️ Environment Requirements
Technology	Version
PHP	8.2+
Node.js	18+
Python	3.10+
MySQL	8.0+
Redis	Latest Stable
Docker	Optional

<<<<<<< HEAD
### Component Details:

1.  **Frontend (React)**:
    - Uses React combined with modern UI libraries.
    - Manages application state, displays messages, and dashboard charts.
2.  **Backend (Laravel)**:
    - Acts as an API Gateway and handles core business logic (Auth, Database, Logging).
    - Manages access control (Sanctum) and coordinates requests to the AI Service.
3.  **AI Service (FastAPI)**:
    - A high-performance Python service specialized in processing AI tasks.
    - Integrates LangChain/LlamaIndex to interact with LLMs.
    - Supports file processing, image processing (OCR), and web scraping.

---

## 🔄 How It Works?

### 1. Message Processing Flow (Chat Flow)

- **Step 1**: User sends a message from the Frontend.
- **Step 2**: Backend receives the request, checks permissions, and saves the message to MySQL.
- **Step 3**: Backend sends the request to the AI Service via HTTP protocol.
- **Step 4**: AI Service processes the content (OCR for files or web search if needed), then calls the LLM API.
- **Step 5**: Results are returned through AI Service -> Backend -> Frontend and displayed to the user.

### 2. Dashboard Data Flow

- All user activities (sending messages, logging in, changing settings) are recorded by the Backend in `activity_logs`.
- When the user accesses the Dashboard, the Backend calculates metrics (Response Time, Success Rate, ...) and returns data for ApexCharts on the Frontend.

---

## 🛠️ Environment Requirements

- **PHP**: 8.2+ (Composer included)
- **Node.js**: 18+ (npm or yarn)
- **Python**: 3.10+ (pip)
- **Database**: MySQL 8.0+ & Redis
- **Additional Tools**: Tesseract OCR (if using OCR), Docker (optional)

---

## 💻 Installation Guide

### Method 1: Quick Run with Docker (Recommended)

```bash
=======
Additional tools:

Composer
npm / yarn
Tesseract OCR (optional for OCR features)
💻 Installation Guide
Option 1: Docker Setup (Recommended)
>>>>>>> a0de1c232751a7d7532c6aec6ccb9225d7e8e6c7
docker-compose up --build

<<<<<<< HEAD
The system will automatically initialize Frontend (3000), Backend (8000), and AI Service (8001).

### Method 2: Manual Installation on Windows

We provide utility scripts to help you get started quickly:

1.  **Install Dependencies**:
    ```bash
    # Run setup script (if available) or install manually:
    cd BackEnd && composer install
    cd ../frontend && npm install
    cd ../ai_service && pip install -r requirements.txt
    ```
2.  **Configure .env**: Copy the `.env.example` files to `.env` in all 3 directories and fill in the necessary information (API Keys, Database config).
3.  **Launch**:
    ```bash
    # Use the combined script
    .\start-all.bat
    ```
=======
Services:

Frontend → localhost:3000
Backend → localhost:8000
AI Service → localhost:8001
Option 2: Manual Setup (Windows)
1. Install Dependencies
# Backend
cd BackEnd
composer install

# Frontend
cd ../frontend
npm install

# AI Service
cd ../ai_service
pip install -r requirements.txt
2. Configure Environment Variables
>>>>>>> a0de1c232751a7d7532c6aec6ccb9225d7e8e6c7

Copy:

<<<<<<< HEAD
## 📊 Default Ports

| Component       | URL / Port                         |
| :-------------- | :--------------------------------- |
| **Frontend**    | `http://localhost:3000`            |
| **Backend API** | `http://localhost:8000`            |
| **AI Service**  | `http://localhost:8001`            |
| **MySQL**       | `3306` (or `3307` if using Docker) |
| **Redis**       | `6379`                             |
=======
.env.example -> .env

Required configuration:
>>>>>>> a0de1c232751a7d7532c6aec6ccb9225d7e8e6c7

Database credentials
Redis configuration
API Keys
AI Provider settings
3. Start the Application
.\start-all.bat
📊 Default Ports
Service	URL / Port
Frontend	http://localhost:3000

<<<<<<< HEAD
## 📝 License

Project developed by **Architect AI Team**. Please contact us for more details regarding copyright.
=======
Backend API	http://localhost:8000

AI Service	http://localhost:8001

MySQL	3306 / 3307
Redis	6379
⚡ Features
Multi-AI Provider Support
Real-time Chat
Markdown Rendering
Code Syntax Highlighting
OCR Image Processing
Web Search Integration
Activity Logging
Dashboard Analytics
Redis Caching
Secure Authentication
Modular Architecture
🔐 Security
Laravel Sanctum Authentication
API Key Management
Request Validation
Role-Based Access Control
Secure Environment Variables
📁 Suggested Project Structure
ChatID/
│
├── frontend/          # React Frontend
├── backend/           # Laravel Backend API
├── ai_service/        # FastAPI AI Service
├── docker/            # Docker Configurations
├── docs/              # Documentation
└── README.md
📈 Future Improvements
Voice Assistant Integration
Real-time Collaboration
AI Agent Automation
Multi-language Support
Plugin Marketplace
Fine-tuned Local Models
👨‍💻 Development Team

Developed by Architect AI Team

📝 License

This project is proprietary software developed by the Architect AI Team.
Please contact the team for licensing and copyright information.
>>>>>>> a0de1c232751a7d7532c6aec6ccb9225d7e8e6c7
