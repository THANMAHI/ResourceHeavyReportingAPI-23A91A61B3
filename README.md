# Resource-Heavy Reporting API with Proxy Pattern

A RESTful API built with TypeScript, Node.js, and Express demonstrating the **Proxy Design Pattern** (specifically **Virtual Proxy** for lazy initialization and **Protection Proxy** for role-based access control).

## Architecture & Design Patterns

The architecture enforces separation of concerns through structural object-oriented design patterns:

- **Subject Interface (`Report`)**: Common interface implemented by `HeavyReportGenerator`, `VirtualReportProxy`, and `ProtectionReportProxy`.
- **Real Subject (`HeavyReportGenerator`)**: Simulates an expensive resource-heavy object. Calling its constructor increments the global counter in `MetricsTracker`.
- **Virtual Proxy (`VirtualReportProxy`)**: Defers instantiation of `HeavyReportGenerator` until `generate()` is invoked. Caches metadata (`id`, `title`, `requiredRole`) for zero-cost queries. Reuses the initialized real subject instance on subsequent generation requests.
- **Protection Proxy (`ProtectionReportProxy`)**: Enforces access control before delegating requests. Rejects unauthorized requests immediately with `403 Forbidden` (`AccessDeniedError`) without instantiating the underlying heavy object.

### Pattern Composition
```
API Controller -> ProtectionReportProxy -> VirtualReportProxy -> HeavyReportGenerator
```

## Seeded Data
On application startup, the system seeds 3 report proxies:
1. `report-1`: Title `"Financial Q1"`, Required Role: `"admin"`
2. `report-2`: Title `"User Analytics"`, Required Role: `"manager"`
3. `report-3`: Title `"System Status"`, Required Role: `"guest"`

## REST API Endpoints

| Method | Endpoint | Description | Expected Status |
|--------|----------|-------------|-----------------|
| `GET` | `/health` | Application health check | `200 OK` |
| `GET` | `/api/metrics` | Retrieve total heavy object instantiations | `200 OK` |
| `POST` | `/api/metrics/reset` | Reset metrics counter and report state | `200 OK` |
| `GET` | `/api/reports` | List all available report metadata (lazy evaluation) | `200 OK` |
| `GET` | `/api/reports/:id/generate?role={role}` | Securely generate report content on demand | `200 OK` / `403 Forbidden` / `404 Not Found` |

### Sample Responses

#### `GET /api/metrics`
```json
{
  "total_instantiations": 0
}
```

#### `GET /api/reports`
```json
[
  { "id": "report-1", "title": "Financial Q1", "required_role": "admin" },
  { "id": "report-2", "title": "User Analytics", "required_role": "manager" },
  { "id": "report-3", "title": "System Status", "required_role": "guest" }
]
```

#### `GET /api/reports/report-3/generate?role=guest`
```json
{
  "id": "report-3",
  "content": "Report content for System Status"
}
```

#### Unauthorized Response (`GET /api/reports/report-1/generate?role=guest`)
```json
{
  "error": "Access Denied"
}
```

#### Non-existent Report (`GET /api/reports/unknown/generate?role=admin`)
```json
{
  "error": "Report not found"
}
```

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Build and start production server:
   ```bash
   npm run build
   npm start
   ```

### Running Tests

Run unit and integration tests with Jest:
```bash
npm test
```

### Containerization with Docker

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Start the service with Docker Compose:
   ```bash
   docker compose up -d --build
   ```

3. Verify health status:
   ```bash
   curl http://localhost:8080/health
   ```
