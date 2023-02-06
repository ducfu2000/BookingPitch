FROM openjdk:17-jdk-alpine
ADD target/*.jar dat-san-rest-api.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "dat-san-rest-api.jar"]