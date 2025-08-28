FROM gradle:8.7-jdk17-alpine AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src src
RUN gradle clean build -x test

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/smashboard-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
