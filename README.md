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

### Production

### Development

## Architecture

### Database Schema

### API Endpoints

## Credits
- Agustin, Mark Lestat C : Co-Lead, Fullstack Developer
- Domingo, Lenar : Frontend Developer
- Luis, Marven : Fullstack Developer
- Morados, Lou Diamond : Lead, Backend Developer
- Nuarin, Georcelle : UI/UX Designer
- Rabang, Gebreyl : Fullstack Developer
