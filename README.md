# movie-listing-app

# How to run:

To run the app, environment variables located in .env file must be setup acording to your system, and Node must be installed.

The app can be run with docker-compose by calling <br>  
                    'sudo docker-compose up' <br>
                                or<br>
                    'sudo docker-compose up -d'<br>
Two containers are setup, one for the Node web app, and other for MongoDB

If you already have an instance of MongoDB, the app can be run by calling
                        'npm install'   - to install all the Node modules
                            and
                        'npm start'     - to run the app

# Environment Variables

SESSION_SECRET: can be set to anything, used by express-session  to hash the session

PORT:   is the port where there server will be listening, make sure the port is available

MONGO_DOCKER_PORT: is the port where the mongodb container will can be accessed

DATABASE_URL: is the url used by mongoose to connect do mongodb.
If you are running a local instance of mongodb outside the container configured in this project, the url will be:
                    mongodb://localhost:MONGO_DOCKER_PORT
If you are connecting to to the mongodb container configured here, the url will be:
                    mongodb://mongodb:MONGO_DOCKER_PORT

MONGO_DOCKER_VOLUME: is the directory where data handled by the mongodb container will be persisted. 

API_KEY: is the api key needed to acess themoviedb.org api
