RUN SERVER
----------
1. Ensure the current working directory is the Collins_Team_3/server directory
2. The up-to-date .env file must inside the server directory
3. Install dependencies "run npm ci"
4. Build container group "docker compose build"
5. Run container group "docker compose up"
6. Tests can be run inside the app container using "npm run test"
7. Tests can be run locally using "npm run test-script"

Common Issues
-------------
1. If a port related error is thrown by docker-compose, make sure ports 3000 and 6379 aren't in use. Alternatively, the port the nodejs app runs on can be changed in the .env file
2. Having an out-of-date .env is a common cause of issues, contact the repo owners for access to the up-to-date .env file.

