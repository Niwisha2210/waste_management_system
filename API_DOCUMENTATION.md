# Smart Waste Management System - API Documentation

## Overview
Base URL: `http://localhost:5000/api/v1`

Authentication: JWT Bearer Token in Authorization header
```
Authorization: Bearer <your_token_here>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "citizen",
  "address": "123 Main St",
  "city": "New York"
}
```

Response: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Get Current User Profile
**GET** `/auth/profile`

Headers: `Authorization: Bearer <token>`

Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "citizen",
    "address": "123 Main St",
    "city": "New York",
    "avatar_url": null,
    "is_active": true,
    "is_verified": false
  }
}
```

### Update Profile
**PUT** `/auth/profile`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "address": "456 New St",
  "city": "Boston"
}
```

Response: `200 OK`

### Change Password
**POST** `/auth/change-password`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

Response: `200 OK`

---

## Smart Bins Endpoints

### Get All Bins
**GET** `/bins`

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Headers: `Authorization: Bearer <token>`

Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "bins": [
      {
        "id": 1,
        "bin_id": "BIN-001",
        "location_name": "Times Square",
        "location_latitude": 40.758,
        "location_longitude": -73.985,
        "bin_type": "large",
        "capacity_liters": 1000,
        "fill_level": 75,
        "status": "half_full",
        "is_active": true,
        "last_collection_time": "2024-01-15 10:30:00",
        "created_at": "2024-01-10 08:00:00",
        "updated_at": "2024-01-15 14:30:00"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### Get Bin by ID
**GET** `/bins/:binId`

Headers: `Authorization: Bearer <token>`

Response: `200 OK`

### Create Bin
**POST** `/bins`

Headers: `Authorization: Bearer <token>` (Admin only)

Request:
```json
{
  "bin_id": "BIN-011",
  "location_name": "New Location",
  "location_latitude": 40.750,
  "location_longitude": -73.990,
  "bin_type": "medium",
  "capacity_liters": 800
}
```

Response: `201 Created`

### Update Bin Fill Level
**PUT** `/bins/:binId/fill-level`

Headers: `Authorization: Bearer <token>` (Admin only)

Request:
```json
{
  "fill_level": 85
}
```

Response: `200 OK`

### Get Bins by Status
**GET** `/bins/status/:status`

Parameters:
- `status`: empty | half_full | full | needs_maintenance

Headers: `Authorization: Bearer <token>`

Response: `200 OK`

### Get Nearby Bins
**GET** `/bins/nearby/list`

Query Parameters:
- `latitude`: User's latitude (required)
- `longitude`: User's longitude (required)
- `radius`: Search radius in km (default: 5)

Headers: `Authorization: Bearer <token>`

Response: `200 OK`

---

## Complaints Endpoints

### Create Complaint
**POST** `/complaints`

Headers: `Authorization: Bearer <token>` (Citizens only)
Content-Type: `multipart/form-data`

Form Data:
- `title`: Complaint title (string)
- `description`: Detailed description (string)
- `category`: garbage_overflow | bin_damage | collection_delay | other
- `image`: Image file (optional)
- `location_latitude`: Latitude (optional)
- `location_longitude`: Longitude (optional)

Response: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "complaint_id": "COMP-1234567890"
  }
}
```

### Get User Complaints
**GET** `/complaints/my-complaints`

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Headers: `Authorization: Bearer <token>` (Citizens)

Response: `200 OK`

### Get All Complaints
**GET** `/complaints`

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (optional)
- `priority`: Filter by priority (optional)

Headers: `Authorization: Bearer <token>` (Admin only)

Response: `200 OK`

### Update Complaint Status
**PUT** `/complaints/:complaintId/status`

Headers: `Authorization: Bearer <token>` (Admin only)

Request:
```json
{
  "status": "resolved",
  "resolution_notes": "Bin was emptied and repaired"
}
```

Response: `200 OK`

### Assign Complaint to Worker
**PUT** `/complaints/:complaintId/assign`

Headers: `Authorization: Bearer <token>` (Admin only)

Request:
```json
{
  "assigned_worker_id": 2
}
```

Response: `200 OK`

---

## Routes Endpoints

### Create Route
**POST** `/routes`

Headers: `Authorization: Bearer <token>` (Admin only)

Request:
```json
{
  "route_name": "Downtown Collection A",
  "assigned_worker_id": 1,
  "assigned_date": "2024-01-20",
  "scheduled_time": "08:00:00",
  "estimated_duration_minutes": 120,
  "bins": [1, 3, 5, 7, 9]
}
```

Response: `201 Created`

### Get All Routes
**GET** `/routes`

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Headers: `Authorization: Bearer <token>` (Admin only)

Response: `200 OK`

### Get Worker Routes
**GET** `/routes/worker/:workerId`

Query Parameters:
- `status`: Filter by status (optional)
- `date`: Filter by date (optional)

Headers: `Authorization: Bearer <token>`

Response: `200 OK`

### Update Route Status
**PUT** `/routes/:routeId/status`

Headers: `Authorization: Bearer <token>` (Admin/Worker)

Request:
```json
{
  "status": "in_progress"
}
```

Response: `200 OK`

### Mark Bin Collected
**PUT** `/routes/:routeId/bins/:binId/collect`

Headers: `Authorization: Bearer <token>` (Worker only)

Request:
```json
{
  "waste_weight_kg": 45.5
}
```

Response: `200 OK`

---

## Analytics Endpoints

### Get Dashboard Analytics
**GET** `/analytics/dashboard`

Headers: `Authorization: Bearer <token>` (Admin/Worker)

Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "total_bins": 25,
    "full_bins": 2,
    "bin_stats": [...],
    "complaint_stats": [...],
    "collection_stats": {
      "today_collections": 8,
      "today_waste_kg": 385.5
    },
    "user_stats": [...]
  }
}
```

### Get Waste Trends
**GET** `/analytics/waste-trends`

Headers: `Authorization: Bearer <token>` (Admin only)

Response: `200 OK`

### Get Complaint Analytics
**GET** `/analytics/complaints`

Headers: `Authorization: Bearer <token>` (Admin only)

Response: `200 OK`

### Get Worker Metrics
**GET** `/analytics/worker-metrics`

Headers: `Authorization: Bearer <token>` (Admin only)

Response: `200 OK`

### Generate Monthly Report
**GET** `/analytics/report/monthly`

Query Parameters:
- `month`: Month number (1-12)
- `year`: Year

Headers: `Authorization: Bearer <token>` (Admin only)

Response: `200 OK`

---

## Predictions Endpoints

### Generate Bin Prediction
**POST** `/predictions/:binId`

Headers: `Authorization: Bearer <token>` (Admin only)

Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "bin_id": "BIN-001",
    "current_fill_level": 75,
    "predicted_fill_level": 82,
    "days_to_full": 2,
    "predicted_collection_date": "2024-01-22",
    "confidence_score": 85,
    "alert_status": "warning"
  }
}
```

### Get Critical Predictions
**GET** `/predictions/critical`

Headers: `Authorization: Bearer <token>` (Admin/Worker)

Response: `200 OK`

### Generate All Predictions
**POST** `/predictions`

Headers: `Authorization: Bearer <token>` (Admin only)

Response: `200 OK`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [...]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Access denied. Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: X-RateLimit-Limit, X-RateLimit-Remaining

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## Data Types

### Bin Status
- `empty` - 0-25% full
- `half_full` - 25-75% full
- `full` - 75-100% full
- `needs_maintenance` - Damaged/Offline

### Complaint Status
- `pending` - Not yet assigned
- `in_progress` - Being handled
- `resolved` - Issue resolved
- `rejected` - Complaint rejected

### Complaint Priority
- `low` - Non-urgent
- `medium` - Standard
- `high` - Urgent
- `critical` - Emergency

### User Roles
- `admin` - System administrator
- `worker` - Collection worker
- `citizen` - Regular user

---

## Testing Guide

### Using cURL
```bash
# Get token
TOKEN=$(curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Use token
curl -X GET http://localhost:5000/api/v1/bins \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman
1. Create new collection
2. Set Authorization type to Bearer Token
3. Import endpoints
4. Set environment variables

### Using Axios (JavaScript)
```javascript
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Make requests
client.get('/bins').then(res => console.log(res.data));
```

---

## Version History

- **v1.0.0** (2024-01-15) - Initial release

---

**Last Updated:** January 2024
