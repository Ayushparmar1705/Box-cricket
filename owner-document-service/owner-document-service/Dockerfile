# Multi-stage build for Owner Document Service

# ---- Build stage ----
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy Maven project files
COPY pom.xml .
COPY src ./src

# Build the jar (skip tests for speed)
RUN mvn -B package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app

# Copy the built jar from the build stage
ARG JAR_FILE=target/*-SNAPSHOT.jar
COPY --from=build /app/${JAR_FILE} app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java","-jar","/app/app.jar"]
