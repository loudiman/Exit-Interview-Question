# Exit Interview Web Application
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Introduction
This Exit Interview web application was developed to facilitate the surveys for alumnis of Saint Louis University this was done for completion of CS 3--: Web Technologies. This was built using PHP and NodeJS as the backend of the application. This web application has two types of users **Admins** and **Alumnis**. Admins can create, edit and publish surveys, on the other hand Alumnis can only answer surveys.

## How to Run
There ar two ways to run the application, you may utilize docker or run the individual backends independently, the former however is more recommended since the configurations are more optimized to be ran this way. NOTE: PHP and NodeJS handle each of the roles that are available in this web application, PHP handles the Alumnis while NodeJS handles the Admin. However the login for both the Alumni and the Admins are handled by the PHP part of the source code.

### via Docker
You may use `docker compose up --build` at the root directory to run the entire web application using docker

### Run Independently

#### Prerequisite
You must have **nginx** installed and configure it to act as a reverse proxy for both the PHP and Nodejs backend

#### NodeJS
To run the nodejs, you would need to be under the `server/nodejs` directory, once you are there you may run the command `npm install` to install the necessary packages,after which you may run `npm start` to start the server, or you may use `npm run dev` to run the server in **development mode**.

#### PHP
To run the php server, specify the document root and use the built-in web server.

## Features

### Log-in
Users are presented with a singular login page, meaning this is the login used for both the Alumnis and Admins.
*Insert Pic Here*

### Admin

#### Dashboard
#### Survey Creation
#### Limit Survey Visibility / Accessibility

### Alumnis

#### Homepage
#### Answering Surveys

## Architecture

### NodeJS File Structure
```
server/
├── nodejs/
│   ├── api-runtime/
│   │   ├── services/
│   │   │   ├── auth-service/
│   │   │   │   ├── controller/
│   │   │   │   ├── routes.js
│   │   │   │   └── index.js
│   │   │   ├── dal-service/
│   │   │   │   ├── controller/
│   │   │   │   ├── model/
│   │   │   │   ├── routes/
│   │   │   │   ├── util/
│   │   │   │   └── index.js
│   │   │   ├── upload-download-service/
│   │   │   │   ├── routes.js
│   │   │   │   ├── util.js
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   ├── api.js
│   │   └── .env
│   ├── main-runtime/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── services/
│   │   │   ├── resource-service/
│   │   │   │   ├── routes/
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   ├── main.js
│   │   └── index.js
│   ├── resources/
│   │   ├── css/
│   │   ├── fonts/
│   │   ├── images/
│   │   ├── js/
│   │   ├── views/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── .env
```

### PHP File Structure
```
server/php/
├── app/
│   ├── Http/
│   │   ├── controllers/
│   │   │   ├── questionnaires/
│   │   │   ├── session/
│   │   │   ├── student/
│   │   │   └── surveys/
│   │   └── Forms/
│   └── Models/
├── Core/
│   ├── Middleware/
│   │   ├── Auth.php
│   │   ├── Guest.php
│   │   └── Middleware.php
│   ├── App.php
│   ├── Authenticator.php
│   ├── Container.php
│   ├── Database.php
│   ├── functions.php
│   ├── Router.php
│   ├── Session.php
│   └── ValidationException.php
├── public/
│   ├── resources/
│   │   ├── css/
│   │   ├── fonts/
│   │   ├── images/
│   │   ├── js/
│   │   └── views/
│   └── index.php
├── bootstrap.php
├── config.php
└── routes.php
```

`/server/php` and `/server/nodejs` houses the php and nodejs backend respectively, each of which handles specific parts of the web application. As discussed earlier php handles everything that the alumnis interact with and the log-in page, while nodejs handles everything the admin interacts with. To which will be discussed further.

### NodeJS
The `/server/nodejs` is split in two components `main-runtime` and `api-runtime`. `main-runtime` handles the serving of the frontend components, you may think of this component as the one responsible for serving both the `View` and `Controller` in an MVC architecture.

The `api-runtime` component is a REST API that provides various microservices for Data Access Layer (DAL), Authentication, and upload/download of images. This component is responsible for interacting with the database and handling the backend logic for the application.

**Features of the `api-runtime` component:**

- **Data Access Layer (DAL) Service:**
  - Manages database interactions for users, surveys, and programs.
  - Provides endpoints to create, read, update, and delete (CRUD) operations on the database.
  - Example endpoints:
    - `GET /api/user-service/users` - Retrieve all users.
    - `POST /api/user-service/user` - Add a new user.
    - `GET /api/survey-service/surveys` - Retrieve all surveys.
    - `DELETE /api/survey-service/survey/:id` - Delete a survey by ID.

- **Authentication Service:**
  - Handles user authentication and authorization.
  - Provides endpoints for token generation and validation.
  - Example endpoints:
    - `GET /api/auth/generate` - Generate an authentication token.
    - `GET /api/auth/authorize` - Authorize a user based on the provided token.

- **Upload/Download Service:**
  - Manages the upload and download of images and other files.
  - Provides endpoints to upload and retrieve files.
  - Example endpoints:
    - `POST /api/upload-download/upload/image/:username` - Upload an image for a specific user.
    - `GET /api/upload-download/image/:filename` - Retrieve an image by filename.


The goal was to achieve a loosely coupled high cohesion architecture, there are still some gaps since this was done as a university requirement which didn't need to have a robust architecture as a requirement, this however allows us to make patches and improvements easily without altering/affecting other services that are necessary for the entire business process.



### PHP

The PHP component of the application handles the alumni user experience and authentication for both alumni and admin users. It follows a custom MVC-like architecture with a focus on routing, middleware, and database interactions.


#### Key Components

- **Core Framework**: Contains foundational components like Router, Session management, Database connections, and Authentication.
- **Middleware**: Implements authentication checks through Auth and Guest classes to control access to routes.
- **Controllers**: Organized by feature (Session, Student, Surveys, Questionnaires) to handle specific business logic.
- **Views**: HTML templates in `public/resources/views/` present the UI to alumni users.
- **Models**: Represent data structures and interact with the database.

#### Application Flow

1. All requests go through the entry point which bootstraps the application
2. Routes defined in `routes.php` determine which controller handles the request
3. Requests pass through middleware to validate access permissions
4. Controllers handle business logic and render appropriate views
5. Views display the UI to alumni users

#### Authentication System

The authentication system handles:
- User login validation
- Session creation and management
- Access control through middleware
- Authentication for both alumni and admin users

This architecture separates concerns while maintaining a coherent flow between components, allowing for maintainable and extensible code.

### Database Schema

## Credits
- Agustin, Mark Lestat C : Co-Lead, Fullstack Developer
- Domingo, Lenar : Frontend Developer
- Luis, Marven : Fullstack Developer
- Morados, Lou Diamond : Lead, Backend Developer
- Nuarin, Georcelle : UI/UX Designer
- Rabang, Gebreyl : Fullstack Developer
