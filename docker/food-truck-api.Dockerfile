FROM openjdk:14 AS build

ENV AMAZON_S3_ACCESS_KEY=<access-key>
ENV AMAZON_S3_SECRET_KEY=<secret-key>
ENV GOOGLE_API_KEY=<api-key>

# Possible to execute the mave bom build here? Would need to dowload maven...

WORKDIR /build

COPY . .
RUN ./gradlew build --no-daemon -p .

FROM openjdk:14
WORKDIR /app
COPY --from=build /build/build/libs/build-*.jar app.jar
COPY ./backend-entrypoint .

RUN chmod +x ./backend-entrypoint

# Running the app
ENTRYPOINT ./backend-entrypoint
