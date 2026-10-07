# -------------------------------------------------
# 1. Stage 1 – Compile Spring Boot app
# -------------------------------------------------
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build JAR skipping tests
RUN mvn clean package -DskipTests -B

# -------------------------------------------------
# 2. Stage 2 – Runtime image
# -------------------------------------------------
FROM eclipse-temurin:25-jre AS runtime

WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Listen on container port 8081
EXPOSE 8081

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
