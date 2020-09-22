FROM openjdk:14 AS build

# Possible to execute the mave bom build here? Would need to dowload maven...

WORKDIR /build

COPY . .
RUN ./gradlew build --no-daemon -p .
RUN ls /build/build/libs/

FROM openjdk:14
WORKDIR /app
COPY --from=build /build/build/libs/build-*.jar app.jar
COPY --from=build /build/build/libs/food-truck-api-*.jar app.jar
COPY ./backend-entrypoint .

RUN chmod +x ./backend-entrypoint

# Running the app
ENTRYPOINT ./backend-entrypoint