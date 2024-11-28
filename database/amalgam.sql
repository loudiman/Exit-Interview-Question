-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 19, 2024 at 06:58 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `amalgam`
--

-- --------------------------------------------------------

-- Drop tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS `responses`;
DROP TABLE IF EXISTS `responders`;
DROP TABLE IF EXISTS `questionaire`;
DROP TABLE IF EXISTS `student`;
DROP TABLE IF EXISTS `survey`;
DROP TABLE IF EXISTS `question`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `program`;

CREATE TABLE `program` (
    `program_id` INT NOT NULL AUTO_INCREMENT,
    `program_name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `question` (
    `question_id` INT NOT NULL AUTO_INCREMENT,
    `question_json` JSON NOT NULL,
    `question_type` ENUM('multiple_choice', 'checkbox', 'essay', 'rating') NOT NULL,
    PRIMARY KEY (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `survey` (
    `survey_id` INT NOT NULL AUTO_INCREMENT,
    `survey_title` VARCHAR(255) NOT NULL,
    `status` ENUM('unpublished', 'published') NOT NULL DEFAULT 'unpublished',
    `program_id` INT NOT NULL,
    `period_start` DATETIME NOT NULL,
    `period_end` DATETIME NOT NULL,
    PRIMARY KEY (`survey_id`),
    FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`) ON DELETE CASCADE,
    CONSTRAINT `chk_period` CHECK (`period_end` >= `period_start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user` (
    `username` INT NOT NULL,
    `hashed_password` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `given_name` VARCHAR(100) NOT NULL,
    `type` TINYINT NOT NULL,
    PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `questionaire` (
    `survey_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    PRIMARY KEY (`survey_id`, `question_id`),
    FOREIGN KEY (`survey_id`) REFERENCES `survey` (`survey_id`) ON DELETE CASCADE,
    FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `responders` (
    `username` INT NOT NULL,
    `survey_id` INT NOT NULL,
    `responded` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`username`, `survey_id`),
    FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE,
    FOREIGN KEY (`survey_id`) REFERENCES `survey` (`survey_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `responses` (
    `response_id` INT NOT NULL AUTO_INCREMENT,
    `survey_id` INT NOT NULL,
    `response_json` JSON NOT NULL,
    `submitted_at` TIMESTAMP NOT NULL,
    PRIMARY KEY (`response_id`),
    FOREIGN KEY (`survey_id`) REFERENCES `survey` (`survey_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `student` (
    `username` INT NOT NULL,
    `program_id` INT NOT NULL,
    `sem` ENUM('first', 'second') NOT NULL,
    `batch` YEAR NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    PRIMARY KEY (`username`),
    FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE,
    FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Populate program table
INSERT INTO `program` (`program_name`) VALUES
('Computer Science'),
('Information Technology'),
('Multimedia Arts');

-- Populate user table with students (type 1)
INSERT INTO `user` (`username`, `hashed_password`, `last_name`, `given_name`, `type`) VALUES
(2233915, 'password123', 'Agustin', 'Mark Lestat', 1),
(2234244, 'password123', 'Luis', 'Marven Joffre', 1),
(2233672, 'password123', 'Morados', 'Lou Diamond', 1);

-- Populate student table
INSERT INTO `student` (`username`, `program_id`, `sem`, `batch`, `gender`) VALUES
(2233915, 3, 'second', 2026, 'male'),
(2234244, 1, 'second', 2026, 'male'),
(2233672, 2, 'second', 2026, 'male');

-- Populate question table with 4 questions per program
INSERT INTO `question` (`question_json`, `question_type`) VALUES
-- Computer Science questions
('{"question": "Which software development methodologies are you familiar with? (Select all that apply)", "options": ["Agile", "Scrum", "Waterfall", "DevOps", "Kanban"]}', 'checkbox'),
('{"question": "I feel confident in applying the programming skills I learned in real-world scenarios.", "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]}', 'multiple_choice'),
('{"question": "In your own words, how has learning about recursion influenced your understanding of programming concepts?"}', 'essay'),
('{"question": "Rate your proficiency in Python programming.", "scale": 5}', 'rating'),

-- Information Technology questions
('{"question": "Which of the following IT certifications have you obtained? (Select all that apply)", "options": ["CompTIA A+", "Cisco CCNA", "AWS Certified Solutions Architect", "Microsoft Certified: Azure Fundamentals", "Google Cloud Professional Cloud Architect"]}', 'checkbox'),
('{"question": "I have a solid understanding of cloud computing concepts.", "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]}', 'multiple_choice'),
('{"question": "Could you describe how cybersecurity impacts your daily work or study environment?"}', 'essay'),
('{"question": "Rate your understanding of cloud computing concepts.", "scale": 5}', 'rating'),

-- Multimedia Arts questions
('{"question": "Which digital tools do you use for graphic design? (Select all that apply)", "options": ["Adobe Photoshop", "Adobe Illustrator", "CorelDRAW", "Inkscape", "GIMP", "Sketch", "Figma"]}', 'checkbox'),
('{"question": "I feel prepared to use Adobe Creative Suite in a professional setting.", "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]}', 'multiple_choice'),
('{"question": "What role does social media play in shaping your approach to digital art and design?"}', 'essay'),
('{"question": "Rate your proficiency in Adobe Creative Suite.", "scale": 5}', 'rating');

-- Create surveys for each program
INSERT INTO `survey` (`survey_title`, `status`, `program_id`, `period_start`, `period_end`) VALUES
('CS Department Evaluation 2024', 'published', 1, '2024-01-01', '2024-12-31'),
('IT Department Evaluation 2024', 'published', 2, '2024-01-01', '2024-12-31'),
('MMA Department Evaluation 2024', 'published', 3, '2024-01-01', '2024-12-31');

-- Populate questionaire 
-- CS Survey questions 
INSERT INTO `questionaire` (`survey_id`, `question_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);

-- IT Survey questions 
INSERT INTO `questionaire` (`survey_id`, `question_id`) VALUES
(2, 5),
(2, 6),
(2, 7),
(2, 8);

-- MMA Survey questions 
INSERT INTO `questionaire` (`survey_id`, `question_id`) VALUES
(3, 9),
(3, 10),
(3, 11),
(3, 12);

-- Populate responders table
INSERT INTO `responders` (`username`, `survey_id`, `responded`) VALUES
(2233915, 1, TRUE),
(2234244, 2, TRUE),
(2233672, 3, TRUE),
(2234244, 1, FALSE); 

-- Populate responses table with specific timestamps
INSERT INTO `responses` (`survey_id`, `submitted_at`, `response_json`) VALUES
(1, '2024-11-05 10:15:30', '[{"question_id":1,"answer":"Functional"},{"question_id":2,"answer":"Yes"},{"question_id":3,"answer":"Recursion is a technique where a function calls itself to solve smaller instances of a problem until it reaches a base case."},{"question_id":4,"rating":4}]'),
(2, '2024-11-12 14:45:00', '[{"question_id":5,"answer":"Mesh"},{"question_id":6,"answer":"Yes"},{"question_id":7,"answer":"Cybersecurity is crucial for protecting sensitive data and ensuring operational continuity in businesses."},{"question_id":8,"rating":5}]'),
(3, '2024-11-18 09:30:10', '[{"question_id":9,"answer":"Contrast"},{"question_id":10,"answer":"Yes"},{"question_id":11,"answer":"Social media has expanded the reach of digital art, allowing artists to connect with wider audiences and showcase their work globally."},{"question_id":12,"rating":4}]');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;