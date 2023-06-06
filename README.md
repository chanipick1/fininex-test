# Client – Server – DB
1. Save events sent from clients and authenticate the POST calls.
2. Process data into a database.
3. Serve the data from the database according to HTTP GET call.
The following Rest API that will be exported:

- GET     `http://localhost:8000/userEvents/user1` get user revenue 
// called user events but the requirement was to receive data from the table
- POST     `http://localhost:8000/liveEvent/`
  - event body 
    - userId – string (for example: ‘abc123’)
    - name – string - we’ll support 2 events: ‘add_revenue’ and ‘subtract_revenue’
    - value – integer (for example: 432), 
  - authorization is required

## Project setup
Install Node.js
```
npm install
```
Set up Docker

Install Docker: Visit the official Docker website (https://www.docker.com) and download the Docker Desktop application for your operating system. Follow the installation instructions to install Docker.
```
npm docker-build
```
### Run
The database is running in docker:
```
npm docker-run
```
```
npm start-server
```
```
npm start-client
```
To run the data_processor please use this command with file name argument
```
ode data_processor.js events1.jsonl
```