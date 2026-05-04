# 🚨 Incident Management System (IMS)

> A resilient, production-grade Incident Management System designed to monitor a distributed stack and manage failure mediation workflows.

## 🔗 GitHub Repository
```
https://github.com/ArlagaddaHepseeba-git/incident-management-system
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INCIDENT MANAGEMENT SYSTEM                        │
└─────────────────────────────────────────────────────────────────────┘

  1. INGESTION LAYER
  ┌──────────────────────┐lll
  │  Error Signals       │
  │  (APIs, Cache, DB,   │──────────────────────────────────────────┐
  │   MCP, Queues)       │                                          │
  └──────────────────────┘                                          ▼

  2. PROCESSING LAYER                                    ┌─────────────────┐
                                                         │  Fastify API    │
  ┌──────────────────┐    ┌──────────────────┐           │  (Node.js)      │
  │  Rate Limiter    │◄───│  POST /signals   │◄──────────│                 │
  │  100 req/min     │    │  POST /incidents │           │  Rate Limited   │
  └──────────────────┘    └──────────────────┘           │  Health Check   │
                                    │                    └─────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼

  3. STORAGE LAYER
  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐
  │   MongoDB   │  │ PostgreSQL  │  │    Redis Cache       │
  │             │  │             │  │                      │
  │ Raw Signals │  │ Work Items  │  │ Real-time Dashboard  │
  │ Audit Log   │  │ RCA Records │  │ State (Hot Path)     │
  │ NoSQL Store │  │ RDBMS       │  │ In-memory Buffer     │
  └─────────────┘  └─────────────┘  └──────────
  └──────────────────────────────────────────────┘

  5. VISUALIZATION LAYER
  ┌──────────────────────────────────────────────┐
  │  React Dashboard (Port 3000)                 │
  │                                              │
  │  ┌─────────────┐  ┌────────────────────────┐ │
  │  │ Live Feed   │  │ Incident Detail + RCA  │ │
  │  │ (Severity   │  │ - Root Cause Category  │ │
  │  │  Sorted)    │  │ - Fix Applied          │ │
  │  │             │  │ - Prevention Steps     │ │
  │  └─────────────┘  └────────────────────────┘ │
  └──────────────────────────────────────────────┘
```

---

## 🖥️ Dashboard Screenshot

The dashboard shows live incidents sorted by severity with full RCA form:

```
---
## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Backend | Node.js + Fastify | High-throughput API server |
| Frontend | React.js | Live dashboard UI |
| NoSQL DB | MongoDB | Raw signals audit log |
| SQL DB | PostgreSQL | Work items & RCA records |
| Cache | Redis | Real-time dashboard state |
| Infrastructure | Docker + Docker Compose | Container orchestration |
| Cloud | AWS EC2 (Amazon Linux 2023) | Hosting |

---

## ✨ Features

- ✅ High-throughput signal ingestion API
- ✅ Rate limiting (100 requests/minute) to prevent cascading failures
- ✅ Incident lifecycle: `OPEN` → `INVESTIGATING` → `RESOLVED` → `CLOSED`
- ✅ Mandatory RCA required to close an incident
- ✅ MTTR (Mean Time To Repair) auto calculation
- ✅ Live dashboard auto-refresh every 5 seconds
- ✅ Health endpoint: `GET /health`
- ✅ Throughput metrics printed every 5 seconds
- ✅ Unit tests for RCA validation
- ✅ Docker Compose for easy setup

---

## 🚀 Setup Instructions

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- npm

### Step 1: Clone the repo
```bash
git clone https://github.com/ArlagaddaHepseeba-git/incident-management-system.git
cd incident-management-system
```

### Step 2: Start databases
```bash
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- PostgreSQL on port 5432
- Redis on port 6379

### Step 3: Start backend
```bash
cd backend
npm install
node index.js
```

Backend runs on: `http://localhost:8000`

### Step 4: Start frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/incidents` | Get all incidents (sorted by severity) |
| POST | `/incidents` | Create new incident |
| GET | `/incidents/:id` | Get incident detail with signals |
| PUT | `/incidents/:id/status` | Update incident status (RCA required to CLOSE) |
| POST | `/signals` | Ingest a new signal |

---

## 🧪 Sample Data

Simulate an RDBMS outage followed by MCP failure:

```bash
# Create P0 DB Outage
curl -X POST http://localhost:8000/incidents \
-H "Content-Type: application/json" \
-d '{"title":"RDBMS Outage","component":"RDBMS","severity":"P0"}'

# Create P1 MCP Failure
curl -X POST http://localhost:8000/incidents \
-H "Content-Type: application/json" \
-d '{"title":"MCP Host Down","component":"MCP_HOST","severity":"P1"}'

# Create P2 Cache Failure
curl -X POST http://localhost:8000/incidents \
-H "Content-Type: application/json" \
-d '{"title":"Cache Failure","component":"CACHE_CLUSTER_01","severity":"P2"}'
```

---

## 🔁 Backpressure Handling

- **Redis** used as in-memory buffer for high-volume signals
- **Rate Limiting** (100 req/min) prevents cascading failures
- System handles signal bursts without crashing the persistence layer
- Async processing ensures non-blocking signal ingestion

---

## 🧪 Running Tests

```bash
cd backend
npx jest tests/rca.test.js
```

Expected output:
```
PASS  tests/rca.test.js
  ✓ RCA is valid when all fields are filled
  ✓ RCA is invalid when rootCause is missing
  ✓ RCA is invalid when rca is null

Tests: 3 passed, 3 total
```

---

## 📊 Observability

- **Health Check:** `GET /health` returns `{"status":"ok","message":"IMS is running"}`
- **Throughput Metrics:** Signals/sec printed to console every 5 seconds
- **Request Logging:** All API requests logged with Fastify logger

---

## 🏗️ Project Structure

```
incident-management-system/
├── backend/
│   ├── index.js          # Main server file
│   ├── models/
│   │   ├── incident.js   # Incident schema
│   │   └── signal.js     # Signal schema
│   ├── routes/
│   │   └── incidents.js  # API routes
│   ├── tests/
│   │   └── rca.test.js   # Unit tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── App.js        # React dashboard
│   └── package.json
├── docker-compose.yml    # Database setup
├── sample-data.json      # Sample failure events
└── README.md
```
```

<img width="1920" height="1080" alt="latest output" src="https://github.com/user-attachments/assets/0db1df1d-01d3-403c-b3aa-f0a8c7fae566"/>
```
---

## 👩‍💻 Submitted by

**Arlagadda Hepseeba**
Infrastructure / SRE Intern Assignment - Zeotap
