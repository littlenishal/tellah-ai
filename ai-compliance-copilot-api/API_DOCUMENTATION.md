# AI Compliance Copilot API Documentation

## Authentication Endpoints

### 1. Sign Up
- **Endpoint**: `/api/auth/signup`
- **Method**: `POST`
- **Description**: Create a new user account
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Success Response**:
  ```json
  {
    "user": {
      "id": "unique-user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "message": "User created successfully"
  }
  ```

### 2. Sign In
- **Endpoint**: `/api/auth/signin`
- **Method**: `POST`
- **Description**: Authenticate user and receive access token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response**:
  ```json
  {
    "accessToken": "jwt-access-token",
    "user": {
      "id": "unique-user-id",
      "email": "user@example.com"
    }
  }
  ```

### 3. Verify Email
- **Endpoint**: `/api/auth/verify-email`
- **Method**: `POST`
- **Description**: Verify user email using OTP
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "token": "verification-token"
  }
  ```
- **Success Response**:
  ```json
  {
    "message": "Email verified successfully",
    "user": { ... }
  }
  ```

### 4. Get Current User
- **Endpoint**: `/api/auth/current-user`
- **Method**: `GET`
- **Description**: Retrieve current authenticated user details
- **Authentication**: Required (Bearer Token)
- **Success Response**:
  ```json
  {
    "user": {
      "id": "unique-user-id",
      "email": "user@example.com"
    }
  }
  ```

### 5. Sign Out
- **Endpoint**: `/api/auth/signout`
- **Method**: `POST`
- **Description**: Log out the current user
- **Authentication**: Required (Bearer Token)
- **Success Response**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

## Conversation Endpoints

### 1. Create Conversation
- **Endpoint**: `/api/conversations`
- **Method**: `POST`
- **Description**: Create a new conversation
- **Authentication**: Required (Bearer Token)
- **Request Body**:
  ```json
  {
    "title": "Compliance Review Discussion"
  }
  ```
- **Success Response**:
  ```json
  {
    "id": "conversation-id",
    "user_id": "user-id",
    "title": "Compliance Review Discussion",
    "created_at": "timestamp"
  }
  ```

### 2. Get Conversations
- **Endpoint**: `/api/conversations`
- **Method**: `GET`
- **Description**: Retrieve all conversations for the authenticated user
- **Authentication**: Required (Bearer Token)
- **Success Response**:
  ```json
  [
    {
      "id": "conversation-id-1",
      "title": "Compliance Review 1",
      "created_at": "timestamp"
    },
    {
      "id": "conversation-id-2",
      "title": "Compliance Review 2",
      "created_at": "timestamp"
    }
  ]
  ```

### 3. Get Conversation by ID
- **Endpoint**: `/api/conversations/:id`
- **Method**: `GET`
- **Description**: Retrieve a specific conversation with its messages
- **Authentication**: Required (Bearer Token)
- **Success Response**:
  ```json
  {
    "id": "conversation-id",
    "title": "Compliance Review",
    "messages": [
      {
        "id": "message-id",
        "content": "Message content",
        "created_at": "timestamp"
      }
    ]
  }
  ```

## Analysis Endpoints

### 1. Analyze Text
- **Endpoint**: `/api/analysis`
- **Method**: `POST`
- **Description**: Perform compliance analysis on text
- **Request Body**:
  ```json
  {
    "text": "Text to analyze",
    "conversation_id": "optional-conversation-id",
    "context": "financial compliance"
  }
  ```
- **Success Response**:
  ```json
  {
    "risk_level": "medium",
    "key_risks": [
      "Potential regulatory violation",
      "Insufficient documentation"
    ],
    "remediation_steps": [
      "Review compliance guidelines",
      "Update documentation"
    ],
    "context_specific_notes": "Additional insights"
  }
  ```

### 2. Get Compliance Findings
- **Endpoint**: `/api/analysis/:messageId/findings`
- **Method**: `GET`
- **Description**: Retrieve compliance findings for a specific message
- **Success Response**:
  ```json
  [
    {
      "id": "finding-id",
      "message_id": "message-id",
      "risk_details": "...",
      "created_at": "timestamp"
    }
  ]
  ```

## Health Check
- **Endpoint**: `/health`
- **Method**: `GET`
- **Description**: Check API server health
- **Success Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "ISO-8601-timestamp",
    "uptime": "server-uptime-seconds",
    "environment": "development|production"
  }
  ```

## Authentication Requirements
- Most endpoints require a Bearer Token in the Authorization header
- Token is obtained during sign-in process
- Format: `Authorization: Bearer <access-token>`

## Error Handling
All endpoints return error responses in the following format:
```json
{
  "error": "Error category",
  "details": "Specific error message"
}
```

## Rate Limiting & Quotas
- Rate limiting and API quotas are managed by Supabase authentication
- Consult Supabase documentation for specific limits
