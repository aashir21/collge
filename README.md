# Collge

### Note
This repository is a duplicate of the original and does not contain the complete commit history, branches, or pull requests. This information can be provided upon request to prove I own and maintain the codebase.

----

Collge is a full-stack social networking platform designed for university students, featuring real-time chat, post sharing, notifications, user discovery, and more. The project is organized into two main parts: a **backend** (microservices architecture) and a **frontend** (React Native app).

---

## Features

### General
- User authentication and profile management
- Real-time chat and messaging
- Post creation, sharing, and commenting
- Notifications for chat and post activities
- User search and discovery
- Find nearby users based on location
- Go out on spontaneous hangouts with others
- Meet people from other university (using our global feed)

## Frontend

The app is currently down due to server costs, however, the app is still being hosted on both [App Store](https://apps.apple.com/gb/app/collge/id6739363142) and [Google Play Store](https://play.google.com/store/apps/details?id=com.collge.collgeio&pli=1)

---

## Backend Structure

The backend is a microservices-based Spring Boot application, with each service responsible for a specific domain. Services communicate via REST APIs and are orchestrated through an API Gateway.

**Backend Directory:** `collge-app-backend/`

### Main Services

- **API-GATEWAY**: Central entry point for all client requests, routing to appropriate services.
- **ADMIN-SERVICE**: Handles admin functionalities like user interests and reporting.
- **CHAT-SERVICE**: Manages real-time chat, chat rooms, and message notifications.
- **CONFIG-SERVER**: Centralized configuration management for all services.
- **NEARBY-SERVICE**: Provides features to find nearby users.
- **NOTIFICATION-SERVICE**: Sends notifications for chat, posts, and other activities.
- **POST-SERVICE**: Manages user posts, comments, replies, and related data.
- **SEARCH-SERVICE**: Implements user and post search functionalities.
- **SERVICE-DISCOVERY**: Eureka server for service registration and discovery.
- **UNIVERSITY-SERVICE**: Handles university data and related endpoints.
- **USER-SERVICE**: Manages user accounts, authentication, and profile data.

Each service contains its own controllers, services, repositories, and models, following standard Spring Boot conventions.

---