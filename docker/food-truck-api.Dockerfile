FROM openjdk:14 AS build

# Possible to execute the mave bom build here? Would need to dowload maven...

WORKDIR /build

COPY . .
RUN ./gradlew build --no-daemon -p .

FROM openjdk:14
WORKDIR /app
COPY --from=build /build/build/libs/food-truck-api-*.jar app.jar
COPY ./backend-entrypoint .

RUN chmod +x ./backend-entrypoint

# Running the app
ENTRYPOINT ./backend-entrypoint