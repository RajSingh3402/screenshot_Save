# API Documentation

The Express.js backend exposes several REST API endpoints used by the Next.js frontend client. All endpoints are prefixed with `/api`.

## 1. Websites CRUD

### Get All Websites
* **Method:** `GET`
* **Path:** `/api/websites`
* **Response:** `200 OK` (Array of Website objects)

### Create Website
* **Method:** `POST`
* **Path:** `/api/websites`
* **Body:**
  ```json
  {
    "name": "My website name",
    "url": "https://my-website-url.com"
  }
  ```
* **Response:** `201 Created` (The created Website object)

### Update Website
* **Method:** `PUT`
* **Path:** `/api/websites/:id`
* **Body:** Fields to update (e.g. `status`, `name`, `url`)
* **Response:** `200 OK` (The updated Website object)

### Delete Website
* **Method:** `DELETE`
* **Path:** `/api/websites/:id`
* **Response:** `200 OK`
  ```json
  { "message": "Website deleted successfully" }
  ```

### Delete All Websites
* **Method:** `DELETE`
* **Path:** `/api/websites`
* **Response:** `200 OK`
  ```json
  { "message": "All websites deleted successfully" }
  ```

### Bulk Import Websites
* **Method:** `POST`
* **Path:** `/api/websites/bulk`
* **Body:** Array of websites to import
  ```json
  [
    { "name": "Site A", "url": "https://a.com" },
    { "name": "Site B", "url": "https://b.com" }
  ]
  ```
* **Response:** `201 Created` (Array of added Website objects)

---

## 2. Reports Explorer

### Get All Reports
* **Method:** `GET`
* **Path:** `/api/reports`
* **Response:** `200 OK` (Array of Report objects including details)

### Download Report PDF
* **Method:** `GET`
* **Path:** `/api/reports/:id/pdf`
* **Response:** `200 OK` (Starts attachment download of the target PDF file)

---

## 3. Users Management

### Get All Users
* **Method:** `GET`
* **Path:** `/api/users`
* **Response:** `200 OK` (Array of User objects)

### Create User
* **Method:** `POST`
* **Path:** `/api/users`
* **Body:**
  ```json
  {
    "name": "Amit Sharma",
    "email": "amit@company.com",
    "role": "Viewer" | "Editor" | "Admin"
  }
  ```
* **Response:** `201 Created` (The created User object)

### Remove User
* **Method:** `DELETE`
* **Path:** `/api/users/:id`
* **Response:** `200 OK`
  ```json
  { "message": "User removed successfully" }
  ```

---

## 4. Settings Configuration

### Get Settings
* **Method:** `GET`
* **Path:** `/api/settings`
* **Response:** `200 OK` (Schedules, Recipients, and SMTP configuration)

### Update Settings
* **Method:** `PUT`
* **Path:** `/api/settings`
* **Body:**
  ```json
  {
    "smtp": {
      "host": "smtp.mailtrap.io",
      "port": "587",
      "user": "username",
      "pass": "password"
    },
    "recipients": [
      { "id": 1700000000000, "email": "recipient@company.com" }
    ],
    "schedules": [
      { "id": 1700000000000, "time": "09:00", "enabled": true }
    ]
  }
  ```
* **Response:** `200 OK` (The updated Settings payload)

---

## 5. Live Capture Engine

### Get Capture Progress
* **Method:** `GET`
* **Path:** `/api/capture-progress`
* **Response:** `200 OK`
  ```json
  {
    "active": true,
    "status": "Checking site 2 of 5...",
    "current": 2,
    "total": 5
  }
  ```

### Trigger Capture Session
* **Method:** `POST`
* **Path:** `/api/capture-now`
* **Response:** `202 Accepted`
  ```json
  { "message": "Capture session started" }
  ```

---

## 6. Excel Bulk Processing

### Parse & Ping URLs (Streamed Response)
* **Method:** `POST`
* **Path:** `/api/excel/process`
* **Body:**
  ```json
  {
    "file": "base64-encoded-string-of-excel-sheet",
    "fileName": "websites.xlsx",
    "demo": false
  }
  ```
  *(Pass `"demo": true` to use the server's pre-loaded sample websites spreadsheet)*
* **Response:** `200 OK` (Streaming `application/x-ndjson` NDJSON events)
  * **Event types:**
    * `init`: `{ "type": "init", "total": 10 }`
    * `progress`: `{ "type": "progress", "current": 2, "total": 10, "batch": [...], "successCount": 2, "failedCount": 0 }`
    * `complete`: `{ "type": "complete", "total": 10, "successCount": 8, "failedCount": 2, "data": [...] }`
    * `error`: `{ "type": "error", "error": "Parser failed" }`
