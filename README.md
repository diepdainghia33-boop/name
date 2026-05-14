# 🌌 ChatID / Architect AI Platform

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

Additional tools:

Composer
npm / yarn
Tesseract OCR (optional for OCR features)
💻 Installation Guide
Option 1: Docker Setup (Recommended)
docker-compose up --build

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

Copy:

.env.example -> .env

Required configuration:

Database credentials
Redis configuration
API Keys
AI Provider settings
3. Start the Application
.\start-all.bat
📊 Default Ports
Service	URL / Port
Frontend	http://localhost:3000

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
