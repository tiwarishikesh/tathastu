-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 14, 2022 at 12:04 PM
-- Server version: 5.7.31
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `santosh_patil`
--

-- --------------------------------------------------------

--
-- Table structure for table `commitee`
--

DROP TABLE IF EXISTS `commitee`;
CREATE TABLE IF NOT EXISTS `commitee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `description` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `commitee`
--

INSERT INTO `commitee` (`id`, `name`, `description`) VALUES
(1, 'Paint Commitee', 'This committee was formed to decide on the painting stuff');

-- --------------------------------------------------------

--
-- Table structure for table `commitee_to_member`
--

DROP TABLE IF EXISTS `commitee_to_member`;
CREATE TABLE IF NOT EXISTS `commitee_to_member` (
  `user_id` int(11) NOT NULL,
  `commitee_id` int(11) NOT NULL,
  `position` varchar(150) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `commitee_to_member`
--

INSERT INTO `commitee_to_member` (`user_id`, `commitee_id`, `position`) VALUES
(3, 1, 'Chairman'),
(2, 1, 'Member');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`) VALUES
(1, 'Sagar Darshan');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(150) NOT NULL,
  `lname` varchar(150) NOT NULL,
  `preference` varchar(15) NOT NULL DEFAULT 'english',
  `role` varchar(75) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fname`, `lname`, `preference`, `role`) VALUES
(1, 'Santosh', 'Patil', 'english', 'superadmin'),
(2, 'Nupoor', 'Bhopi', 'english', 'member'),
(3, 'Rishikesh', 'Tiwari', 'english', 'member');

-- --------------------------------------------------------

--
-- Table structure for table `user_authentication`
--

DROP TABLE IF EXISTS `user_authentication`;
CREATE TABLE IF NOT EXISTS `user_authentication` (
  `id` int(11) NOT NULL,
  `password` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_authentication`
--

INSERT INTO `user_authentication` (`id`, `password`) VALUES
(1, '$2y$10$99EQFdJ.zmGXFtedvIOGZuSeSS/t51r/7O0x5MukiNKtt2cMyK1.S');

-- --------------------------------------------------------

--
-- Table structure for table `user_contact`
--

DROP TABLE IF EXISTS `user_contact`;
CREATE TABLE IF NOT EXISTS `user_contact` (
  `user_id` int(11) NOT NULL,
  `contact_type` varchar(50) NOT NULL,
  `contact_detail` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_contact`
--

INSERT INTO `user_contact` (`user_id`, `contact_type`, `contact_detail`) VALUES
(1, 'email', 'santosh@patil.com'),
(2, 'email', 'nupoor@kanris.biz'),
(2, 'phone', '9167053482');

-- --------------------------------------------------------

--
-- Table structure for table `user_room`
--

DROP TABLE IF EXISTS `user_room`;
CREATE TABLE IF NOT EXISTS `user_room` (
  `user_id` int(11) NOT NULL,
  `current_room_number` varchar(50) NOT NULL,
  `current_wing` int(10) DEFAULT NULL,
  `new_room_number` varchar(50) DEFAULT NULL,
  `new_wing` int(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_room`
--

INSERT INTO `user_room` (`user_id`, `current_room_number`, `current_wing`, `new_room_number`, `new_wing`) VALUES
(2, '501', 1, '504', 2),
(3, '502', 1, '504', 2);

-- --------------------------------------------------------

--
-- Table structure for table `wings`
--

DROP TABLE IF EXISTS `wings`;
CREATE TABLE IF NOT EXISTS `wings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `type` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `wings`
--

INSERT INTO `wings` (`id`, `name`, `type`) VALUES
(1, 'A', 'old'),
(2, 'Amelie', 'new'),
(3, 'B', 'old'),
(4, 'Babette', 'new');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
