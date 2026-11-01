# minimarket
First part of the lab session on Thursday, October 15, 2026
# Minimarket Web Application

A responsive, monolithic full-stack Minimarket management application built with **Spring Boot MVC**, **Thymeleaf**, and **Vanilla JavaScript**. 

This application operates strictly on a traditional server-side rendering (SSR) architecture without using REST APIs or asynchronous JSON `fetch` calls. All user actions (CRUD operations) are processed via standard HTTP requests handled directly by Spring controllers and rendered dynamically on the server.

---

## Key Features

- **Traditional MVC Architecture**: Built using `@Controller` to render HTML templates on the server using Thymeleaf.
- **Form-Based Product Management (CRUD)**: Create, read, update, and delete products using standard HTML forms and HTTP GET/POST redirects.
- **Client-Side Live Search**: Real-time instant product filtering using light Vanilla JavaScript over DOM elements.
- **Modal-Based Interactions**: Pop-up windows for product details and product administration to maintain a smooth single-page feel.
- **Responsive UI**: Modern UI crafted with Tailwind CSS and FontAwesome icons, locked in Latin American Spanish (`es-EC`).
- **Data Persistence**: Integrated with PostgreSQL using Spring Data JPA and Hibernate.

---

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.x**
  - Spring MVC (`@Controller`)
  - Spring Data JPA
- **Thymeleaf Engine**
- **PostgreSQL Database**

### Frontend
- **Vanilla JavaScript (ES6+)** (DOM Manipulation & Modal Logic)
- **Tailwind CSS** (Utility-first styling via CDN)
- **FontAwesome 6** (Icons)

---

## Project Structure

```text
minimarket/
├── gateway/
│   └── nginx.conf
├── minimarket/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/minimarket/minimarket/
│   │   │   │       ├── MinimarketApplication.java
│   │   │   │       ├── controller/ProductViewController.java
│   │   │   │       ├── model/Product.java
│   │   │   │       ├── repository/ProductRepository.java
│   │   │   │       └── service/ProductService.java
│   │   │   └── resources/
│   │   │       ├── static/
│   │   │       │   ├── css/styles.css
│   │   │       │   ├── js/app.js
│   │   │       │   └── data_minimarket/
│   │   │       ├── templates/index.html
│   │   │       └── application.properties
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
├── deploy.sh
├── docker-compose.yml
└── README.md
```

---

## Dockerization & Cloud Deployment (WEB-2)

This section outlines the process used to containerize the Minimarket application using Docker, publish the image to Docker Hub, and deploy it onto an AWS EC2 instance alongside a PostgreSQL database, an API Gateway, and a companion service.

### 1. Local Package Build
Before building the container image, the application is packaged into an executable `.jar` file using Maven while skipping unit tests for efficiency:
```bash
./mvnw clean package -DskipTests
```

### 2. Architecture & API Gateway Integration

To prevent security vulnerabilities and eliminate unnecessary exposed ports:
- **Zero Exposed Ports for Backend & DB**: Neither the Spring Boot application (port `8080`) nor the PostgreSQL database (port `5432`) expose ports to the public host or external network. Both run isolated inside the internal Docker bridge network (`minimarket_net`).
- **Nginx API Gateway**: Functions as the single, lightweight secure entry point. It handles incoming traffic, attaches standard security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`), and proxies requests internally to `minimarket-app:8080`.
- **Coexistence on AWS EC2**: Default host port mapping is set to `8082:80` (configurable via `GATEWAY_PORT`) to run seamlessly alongside existing applications on the same EC2 instance without port collisions.
- **Resource Management**: Memory is constrained with `JAVA_TOOL_OPTIONS: "-Xms128m -Xmx256m"` to prevent Out-Of-Memory (OOM) errors in shared EC2 instances.

### 3. AWS S3 Database Provisioning

The database schema and initial product catalog are restored from a SQL dump stored in **AWS S3**:
1. The EC2 instance downloads the SQL dump from S3 using `aws s3 cp s3://<your-bucket>/minimarket_db.sql ./init.sql`.
2. Ensure the EC2 instance has an associated **IAM Role** (or configured credentials via `aws configure`) with `s3:GetObject` permissions to allow downloading from S3.
3. The file `./init.sql` is mounted to `/docker-entrypoint-initdb.d/init.sql:ro` inside the PostgreSQL container, which automatically executes and populates the database on first boot.

### 4. Single-Command Deployment

Run the automated deployment script on the EC2 instance:
```bash
chmod +x deploy.sh && ./deploy.sh s3://<your-bucket>/minimarket_db.sql
```

Alternatively, deploy using standard commands:
```bash
# 1. Download database dump from AWS S3
aws s3 cp s3://<your-bucket>/minimarket_db.sql ./init.sql

# 2. Start container stack in background
docker compose up -d
```
