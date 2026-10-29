# Use an official OpenJDK runtime as a parent image based on Java 21
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the packaged Spring Boot JAR file into the container
COPY target/minimarket-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 for the Minimarket application
EXPOSE 8080

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]