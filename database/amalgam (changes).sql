-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2024 at 04:01 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `program_id` int(11) NOT NULL,
  `program_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`program_id`, `program_name`) VALUES
(1, 'Computer Science'),
(2, 'Information Technology'),
(3, 'Multimedia Arts'),
(4, 'Data Science'),
(5, 'Cybersecurity'),
(6, 'Digital Marketing'),
(7, 'Artificial Intelligence'),
(8, 'Game Development');

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `question_id` int(11) NOT NULL,
  `question_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`question_json`)),
  `question_type` enum('multiple_choice','essay','rating') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`question_id`, `question_json`, `question_type`) VALUES
(1, '{\"question\": \"The programming assignments helped me understand the course material better.\", \"options\": [\"Strongly Disagree\", \"Disagree\", \"Neutral\", \"Agree\", \"Strongly Agree\"]}', 'multiple_choice'),
(2, '{\"question\": \"I feel confident in applying the programming skills I learned in real-world scenarios.\", \"options\": [\"Strongly Disagree\", \"Disagree\", \"Neutral\", \"Agree\", \"Strongly Agree\"]}', 'multiple_choice'),
(3, '{\"question\": \"In your own words, how has learning about recursion influenced your understanding of programming concepts?\"}', 'essay'),
(4, '{\"question\": \"Rate your proficiency in Python programming.\", \"scale\": 5}', 'rating'),
(5, '{\"question\": \"Which network topology is most resilient to failures?\", \"options\": [\"Star\", \"Ring\", \"Mesh\", \"Bus\"]}', 'multiple_choice'),
(6, '{\"question\": \"The course covered essential network security concepts effectively.\", \"options\": [\"Strongly Disagree\", \"Disagree\", \"Neutral\", \"Agree\", \"Strongly Agree\"]}', 'multiple_choice'),
(7, '{\"question\": \"I have a solid understanding of cloud computing concepts.\", \"options\": [\"Strongly Disagree\", \"Disagree\", \"Neutral\", \"Agree\", \"Strongly Agree\"]}', 'multiple_choice'),
(8, '{\"question\": \"Could you describe how cybersecurity impacts your daily work or study environment?\"}', 'essay'),
(9, '{\"question\": \"Rate your understanding of cloud computing concepts.\", \"scale\": 5}', 'rating'),
(10, '{\"question\": \"Which color theory principle is most important in design?\", \"options\": [\"Contrast\", \"Balance\", \"Unity\", \"Rhythm\"]}', 'multiple_choice'),
(11, '{\"question\": \"The design principles taught in the course were easy to apply in projects.\", \"options\": [\"Strongly Disagree\", \"Disagree\", \"Neutral\", \"Agree\", \"Strongly Agree\"]}', 'multiple_choice'),
(12, '{\"question\": \"How relevant are the current course materials to industry standards?\", \"options\": [\"Not Relevant\", \"Somewhat Relevant\", \"Relevant\", \"Very Relevant\"]}', 'multiple_choice'),
(13, '{\"question\": \"Describe a challenging project you worked on this semester.\"}', 'essay'),
(14, '{\"question\": \"Rate your experience with collaborative coding tools.\", \"scale\": 5}', 'rating'),
(15, '{\"question\": \"Which machine learning algorithm do you find most interesting?\", \"options\": [\"Neural Networks\", \"Decision Trees\", \"Random Forest\", \"Support Vector Machines\"]}', 'multiple_choice'),
(16, '{\"question\": \"How effectively did the course prepare you for real-world challenges?\", \"options\": [\"Strongly Disagree\", \"Disagree\", \"Neutral\", \"Agree\", \"Strongly Agree\"]}', 'multiple_choice'),
(19, '{\"question\":\"asdf\",\"options\":[\"asdf\",\"asdf\",\"asdf\"],\"scale\":[]}', ''),
(20, '{\"question\":\"asdf\",\"options\":[\"asdf\"],\"scale\":[]}', '');

-- --------------------------------------------------------

--
-- Table structure for table `questionaire`
--

CREATE TABLE `questionaire` (
  `survey_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questionaire`
--

INSERT INTO `questionaire` (`survey_id`, `question_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(3, 10),
(3, 11),
(3, 12),
(4, 12),
(4, 13),
(4, 14),
(5, 15),
(5, 16),
(6, 12),
(6, 13),
(6, 14),
(11, 19),
(12, 20);

-- --------------------------------------------------------

--
-- Table structure for table `responders`
--

CREATE TABLE `responders` (
  `username` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `responded` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `responders`
--

INSERT INTO `responders` (`username`, `survey_id`, `responded`) VALUES
(2233672, 2, 0),
(2233915, 1, 1),
(2233944, 1, 0),
(2234244, 3, 1),
(2234244, 11, 0),
(2234244, 12, 0),
(2234245, 4, 0),
(2234246, 5, 0),
(2234247, 6, 1),
(2234248, 4, 1),
(2234248, 5, 0),
(2234249, 5, 1),
(2234249, 6, 0);

-- --------------------------------------------------------

--
-- Table structure for table `responses`
--

CREATE TABLE `responses` (
  `response_id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `response_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`response_json`)),
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `responses`
--

INSERT INTO `responses` (`response_id`, `survey_id`, `response_json`, `submitted_at`) VALUES
(1, 1, '[{\"question_id\":1,\"answer\":\"Functional\"},{\"question_id\":2,\"answer\":\"Yes\"},{\"question_id\":3,\"answer\":\"Recursion is a technique where a function calls itself to solve smaller instances of a problem until it reaches a base case.\"},{\"question_id\":4,\"rating\":4}]', '2024-12-01 20:11:55'),
(3, 3, '[{\"question_id\":9,\"answer\":\"Contrast\"},{\"question_id\":10,\"answer\":\"Yes\"},{\"question_id\":11,\"answer\":\"Social media has expanded the reach of digital art, allowing artists to connect with wider audiences and showcase their work globally.\"},{\"question_id\":12,\"rating\":4}]', '2024-12-01 20:11:55'),
(5, 5, '[{\"question_id\":15,\"answer\":\"Neural Networks\"},{\"question_id\":16,\"answer\":\"Neutral\"}]', '2024-12-02 16:45:22'),
(6, 6, '[{\"question_id\":12,\"answer\":\"Very Relevant\"},{\"question_id\":13,\"answer\":\"Created an AI-powered chatbot for customer service using natural language processing.\"},{\"question_id\":14,\"rating\":4}]', '2024-12-03 10:15:30');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `username` int(11) NOT NULL,
  `program_id` int(11) NOT NULL,
  `sem` enum('first','second') NOT NULL,
  `batch` year(4) NOT NULL,
  `gender` enum('male','female') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`username`, `program_id`, `sem`, `batch`, `gender`) VALUES
(2233672, 2, 'second', '2026', 'male'),
(2233915, 3, 'second', '2026', 'male'),
(2234244, 1, 'second', '2026', 'male');

-- --------------------------------------------------------

--
-- Table structure for table `survey`
--

CREATE TABLE `survey` (
  `survey_id` int(11) NOT NULL,
  `survey_title` varchar(255) NOT NULL,
  `survey_description` varchar(255) DEFAULT NULL,
  `status` enum('unpublished','published') NOT NULL DEFAULT 'unpublished',
  `program_id` int(11) DEFAULT NULL,
  `period_start` datetime NOT NULL,
  `period_end` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `survey`
--

INSERT INTO `survey` (`survey_id`, `survey_title`, `survey_description`, `status`, `program_id`, `period_start`, `period_end`) VALUES
(1, 'CS Department Evaluation 2024', NULL, 'published', 1, '2025-11-17 07:00:00', '2026-11-18 23:00:00'),
(2, 'IT Department Evaluation 2024', NULL, 'published', 2, '2024-11-17 08:00:00', '2024-11-20 23:00:00'),
(3, 'MMA Department Evaluation 2024', NULL, 'unpublished', 3, '2024-12-01 09:00:00', '2025-01-31 23:00:00'),
(4, 'Data Science Program Review 2024', 'Comprehensive feedback on DS curriculum', 'published', 4, '2024-11-01 08:00:00', '2025-01-31 23:00:00'),
(5, 'Cybersecurity Evaluation 2024', 'Assessing current security training programs', 'published', 5, '2024-11-01 07:00:00', '2024-11-30 23:00:00'),
(6, 'AI and Machine Learning Survey 2024', 'Gathering insights on AI education', 'unpublished', 7, '2024-11-22 09:00:00', '2024-12-31 23:00:00'),
(11, 'asdf', 'asdf', 'unpublished', 0, '2024-11-13 23:59:00', '2024-11-30 23:59:00'),
(12, 'asdf', 'asdf', 'unpublished', 0, '2024-11-04 23:59:00', '2024-11-12 23:59:00');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` int(11) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `given_name` varchar(100) NOT NULL,
  `type` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `hashed_password`, `last_name`, `given_name`, `type`) VALUES
(2233672, 'password123', 'Morados', 'Lou Diamond', 1),
(2233915, 'password123', 'Agustin', 'Mark Lestat', 1),
(2233944, 'pass123', 'Rabang', 'Gebreyl Isaac', 0),
(2234244, 'password123', 'Luis', 'Marven Joffre', 1),
(2234245, 'password123', 'Garcia', 'Elena Maria', 0),
(2234246, 'password123', 'Wong', 'David Chen', 1),
(2234247, 'password123', 'Nguyen', 'Anh Thu', 1),
(2234248, 'password123', 'Rodriguez', 'Carlos Miguel', 0),
(2234249, 'password123', 'Kim', 'Soo-Jin', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`question_id`);

--
-- Indexes for table `questionaire`
--
ALTER TABLE `questionaire`
  ADD PRIMARY KEY (`survey_id`,`question_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `responders`
--
ALTER TABLE `responders`
  ADD PRIMARY KEY (`username`,`survey_id`),
  ADD KEY `survey_id` (`survey_id`);

--
-- Indexes for table `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`response_id`),
  ADD KEY `survey_id` (`survey_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`username`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `survey`
--
ALTER TABLE `survey`
  ADD PRIMARY KEY (`survey_id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `responses`
--
ALTER TABLE `responses`
  MODIFY `response_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `survey`
--
ALTER TABLE `survey`
  MODIFY `survey_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `questionaire`
--
ALTER TABLE `questionaire`
  ADD CONSTRAINT `questionaire_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`survey_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `questionaire_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `responders`
--
ALTER TABLE `responders`
  ADD CONSTRAINT `responders_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE,
  ADD CONSTRAINT `responders_ibfk_2` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`survey_id`) ON DELETE CASCADE;

--
-- Constraints for table `responses`
--
ALTER TABLE `responses`
  ADD CONSTRAINT `responses_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`survey_id`) ON DELETE CASCADE;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
