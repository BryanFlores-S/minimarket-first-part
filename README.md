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
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── minimarket/
│   │   │           └── minimarket/
│   │   │               ├── MinimarketApplication.java
│   │   │               ├── controller/
│   │   │               │   └── ProductViewController.java
│   │   │               ├── model/
│   │   │               │   └── Product.java
│   │   │               ├── repository/
│   │   │               │   └── ProductRepository.java
│   │   │               └── service/
│   │   │                   └── ProductService.java
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── css/
│   │       │   │   └── styles.css
│   │       │   ├── js/
│   │       │   │   └── app.js
│   │       │   └── data_minimarket/
│   │       ├── templates/
│   │       │   └── index.html
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md


## Dockerization & Cloud Deployment (WEB-2)

This section outlines the process used to containerize the Minimarket application using Docker, publish the image to Docker Hub, and deploy it onto an AWS EC2 instance alongside a PostgreSQL database and a companion service.

### 1. Local Package Build
Before building the container image, the application is packaged into an executable `.jar` file using Maven while skipping unit tests for efficiency:
```bash
./mvnw clean package -DskipTests