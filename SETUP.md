# Development Setup Guide

## External Service Setup

Amazon S3

-   Follow **Step 1 / Create IAM User** of the tutorial here: https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/get-started.html#get-started-setup
-   Take note of the Access Key ID and the Secret Access Key for later.

Google Cloud Services

-   Create an API key: https://cloud.google.com/docs/authentication/api-keys#creating_an_api_key
-   Select the "Maps Javascript API" and "Places API": https://cloud.google.com/docs/authentication/api-keys#adding_api_restrictions
-   Take note of the API key for laters

## Backend Setup (food-truck-api)

Install Java 14 (OpenJDK) if needed

-   Run `brew cask install java`

Install Docker Desktop for Mac from [DockerHub](https://docs.docker.com/docker-for-mac/install/)

-   Increase Memory for Docker Engine to at least 4.00 GB so MySQL Server container has sufficient resources (Docker Desktop > Preferences > Resources > Memory, "Apply & Restart")

Setup Project in IntelliJ

-   Import the project at the `food-truck-finder` parent dir (root of repository) into IntelliJ using existing sources
-   Import the inner `food-truck-api` sub directory
    -   Go File > Project Structure > Modules > + > Import Module
    -   For this, choose to import using external model with Gradle
    -   IntelliJ should autodetect your Gradle project and download dependencies
-   Configure Lombok
    -   Install Lombok Plugin for IntelliJ (IntelliJ IDEA > Preferences > Plugins ... Search for "Lombok" by Michail Plushnikov)
    -   Enable Annotation Processing in IntelliJ Compliation (IntelliJ IDEA > Preferences > Build, Execution, Deployment > Compiler > Annotation Processors > Check "Enable annotation processing")

Deploy MySql: `docker-compose -f ./docker/local.docker-compose.yml up -d`

-   If you need to stop the containers (`docker-compose -f ./docker/local.docker-compose.yml stop` or ctrl+C), you can
    restart the containers with: `docker-compose -f ./docker/local.docker-compose.yml start`

From IntelliJ, create the default `food-truck-finder` database on the server: File > New > Data Source > Mysql

-   Configure the connection:
    -   Name: FTF - Local
    -   Host: localhost
    -   Port: 3306
    -   User: root
    -   Password: password
-   Test Connection and hit OK
-   On the right-hand side of IntelliJ, click on the "Database" option
-   For the food-truck-finder database, right click and navigate to New > Database
-   Add a new database named food-truck-finder and hit OK

Startup the API from IntelliJ SpringBoot Run Configuration

-   Specify VM Options
    ```
    -Dspring.profiles.active=development
    ```
    ```
    GET localhost:8080/ping
    pong!
    ```
-   Specify environment variables
    ```
    AMAZON_S3_ACCESS_KEY=<s3-access-key>
    AMAZON_S3_SECRET_KEY=<s3-secrey-key>
    GOOGLE_API_KEY=<google-api-key>
    ```

## Frontend Setup (food-truck-frontend)

1. Install Homebrew if you don't already have it: https://brew.sh/
2. Run Homebrew to install Node: `brew install node`
3. Run Homebrew to install Yarn: `brew install yarn`
4. Navigate to the food-truck-frontend directory
5. Install frontend dependencies: `yarn install`
6. Run the frontend dev server: `yarn dev`

## Heroku Setup

1. Create symbolic links for the `Dockerfile`s
    - `(cd food-truck-api && ln -s ../docker/food-truck-api.Dockerfile Dockerfile)`
    - `(cd food-truck-api && ln -s ../docker/food-truck-api.Dockerfile Dockerfile)`
2. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Login to the CLI: `heroku container:login`
4. _In both `food-truck-api` AND `food-truck-frontend`_:
    1. Create an app: `heroku create`
    2. Build the Docker image: `heroku container:push web --app <app-name>`
    3. Release the Docker image: `heroku container:release web --app <app-name>`
5. Edit `food-truck-frontend/.env` and `food-truck-frontend/.env.ci` with the backend URL.
6. Login to the Heroku dashboard in a browser and add the following Config Vars to the _frontend_ app (Settings > Reveal Config Vars):

-   `GOOGLE_MAPS_API_KEY=<google-api-key>`

7. Login to the Heroku dashboard in a browser and add the following Config Vars to the _backend_ app (Settings > Reveal Config Vars):

-   `AMAZON_S3_ACCESS_KEY=<s3-access-key>`
-   `AMAZON_S3_SECRET_KEY=<s3-secret-key>`
-   `GOOGLE_API_KEY=<google-api-key>`
-   `JAVA_OPTS=-XX:+UseContainerSupport`

7. On the "Resources" tab for the _backend_ app, add the ClearDB MySQL addon
