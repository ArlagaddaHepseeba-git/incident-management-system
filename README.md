# Incident Management System (IMS)

## Architecture
- Backend: Node.js + Fastify
- Database: MongoDB (signals), PostgreSQL (work items), Redis (cache)
- Frontend: React.js
- Container: Docker + Docker Compose

## Setup Instructions

### Prerequisites
- Docker
- Node.js
- npm

### Run the project

1. Clone the repo
git clone https://github.com/ArlagaddaHepseeba-git/incident-management-system.git

2. Start databases
docker-compose up -d

3. Start backend
cd backend
node index.js

4. Start frontend
cd frontend
npm start

## Backpressure Handling
- Redis is used as in-memory buffer
- Signals are queued before writing to MongoDB
- Rate limiting applied on ingestion API

## Health Check
GET /health
