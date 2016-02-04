# Dockerized Projects worker service
Projects worker micro-service on Node.js

* [Architecture](#architecture)
* [Technologies](#technologies)
* [Environment Variables](#environment-variables)
* [Events](#events)
* [License](#license)

# Architecture
The application is a worker service listening messages from the Bus. Creates sample project for new user and deletes projects.

# Technologies
* Node.js
* MongoDB/Mongoose
* Official nsqjs driver for NSQ messaging service

# Environment Variables
The service should be properly configured with following environment variables.

Key | Value | Description
:-- | :-- | :-- 
NSQLOOKUPD_ADDRESSES | nsqlookupd1:4161,nsqlookupd2:4161 | TCP addresses for nsqlookupd instances to read messages from.
MONGODB_CONNECTION | mongodb://mongo_host:mongo_port/projects | MongoDB connection string.
SAMPLE_PROJECTID | 56aa4524de9e523c21b4205d | Id of sample project
SAMPLE_PRIVATE | true/false| Default privacy for sample project 
SAMPLE_HIDDEN | true/false| Default visibility for sample project

# Events
The service listens events from the Bus (messaging service).

## Receive events

Topic | Channel | Params | Description
:-- | :-- | :-- | :--
project-deletes | project | { id: *project_id* } | Delete projects
account-creates | project | { id: *user_id*, role: *user_role*, created: *user_created_date*, membership: { id: *id*, provider: *authentication_provider*, email: *user_email*, name: *user_name* } } | Create sample project for new user
account-deletes | project | { id: *user_id* } | Delete all user projects
account-merges | project |  | Change project owner

# License
Source code is under GNU GPL v3 [license](LICENSE).
