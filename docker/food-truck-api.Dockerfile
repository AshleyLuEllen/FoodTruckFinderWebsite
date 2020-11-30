FROM openjdk:14 AS build

ENV AMAZON_S3_ACCESS_KEY=AKIASMPQTUATZZVNUIH2
ENV AMAZON_S3_SECRET_KEY=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
ENV GOOGLE_API_KEY=AIzaSyDSDFlqV9UDWh6V0D6STb7JU0-niCSb91U

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