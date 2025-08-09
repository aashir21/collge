FROM openjdk:17
EXPOSE 9092
ADD target/API-GATEWAY-*.jar API-GATEWAY.jar
ENTRYPOINT ["java","-jar","/API-GATEWAY.jar"]
