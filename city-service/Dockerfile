# -------------------------------------------------
# 1️⃣ Stage 1 – compile the Spring Boot app
# -------------------------------------------------
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app

# Copy only the pom first (caches dependencies)
COPY pom.xml .

# Download dependencies (will be cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Package the application (skip tests for speed)
RUN mvn clean package -DskipTests -B

# -------------------------------------------------
# 2️⃣ Stage 2 – runtime (eclipse-temurin JRE)
# -------------------------------------------------
FROM eclipse-temurin:25-jre AS runtime

WORKDIR /app

# Copy the built JAR from the first stage
COPY --from=build /app/target/*.jar app.jar

# City service listens on port 8085
EXPOSE 8085

# Run the Spring Boot app - path is /app/app.jar because WORKDIR is /app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
