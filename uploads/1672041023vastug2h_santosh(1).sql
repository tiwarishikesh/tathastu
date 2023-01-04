-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 22, 2022 at 07:39 AM
-- Server version: 5.7.23-23
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vastug2h_santosh`
--

-- --------------------------------------------------------

--
-- Table structure for table `commitee`
--

CREATE TABLE `commitee` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `description` varchar(500) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `commitee_to_member`
--

CREATE TABLE `commitee_to_member` (
  `user_id` int(11) NOT NULL,
  `commitee_id` int(11) NOT NULL,
  `position` varchar(150) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `name` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(2500) COLLATE utf8_unicode_ci NOT NULL,
  `filename` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
  `datetime` bigint(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `name`, `description`, `filename`, `datetime`) VALUES
(9, 'Society Registration Certificate', '.', '1671453629SocietyRegistrationCertificate.pdf', 1671453629),
(10, 'Society 7/12  ( 15 / 3 / A )', '.', '1671454682SocietySatbara1.pdf', 1671454683),
(11, 'Society 7/12 ( 15 / 8 / A)', '.', '1671454730SocietySatbara2.pdf', 1671454730),
(12, 'Society Ferfar Application & Fees', '.', '1671454787SocietyFerfarApplication&Fees.pdf', 1671454787),
(13, 'Society Ferfar 5600', '.', '1671454847SocietyFerfar5600.pdf', 1671454847),
(14, 'Society Ferfar 5677', '.', '1671454913SocietyFerfar5677.pdf', 1671454913),
(15, 'Society Ferfar 5715', '.', '1671454955SocietyFerfar5715.pdf', 1671454955),
(16, 'Application For Gut Book Map & Reply', '.', '1671455022ApplicationForGutBookMap&Reply.pdf', 1671455022),
(17, 'NA TAX Reciept', '.', '1671455097NATAXReciept.pdf', 1671455097),
(18, 'PMC Agreement', '.', '1671455171PMCAgreement.pdf', 1671455171),
(19, 'AGM - 25 -09 - 2022', '.', '1671455267AGM-25-09-2022.pdf', 1671455267),
(20, 'SGM - 07 - 08 - 2022', '.', '1671455329SGM-07-08-2022.pdf', 1671455329),
(21, 'Acknowledgment of Sub Registrar AGM - 25 - 09 - 2022', '.', '1671455442AcknoledgemntofSubRegistrarAGM-25-09-2022.pdf', 1671455442),
(22, 'Acknowledgment of Sub Registrar SGM - 07 - 08 - 2022', '.', '1671455486AcknoledgemntofSubRegistrarSGM-07-08-2022.pdf', 1671455486),
(23, 'Govt. Land Survey Notice', '.', '1671456494Govt.LandSurveyNotice.pdf', 1671456494),
(24, 'Latest Property Tax Receipt', '.', '1671461053LatestPropertyTaxReceipt.pdf', 1671461054),
(25, 'Society Pan Card', '.', '1671461087SocietyPanCard.pdf', 1671461087);

-- --------------------------------------------------------

--
-- Table structure for table `document_views`
--

CREATE TABLE `document_views` (
  `member_id` int(11) NOT NULL,
  `document_id` int(11) NOT NULL,
  `datetime` bigint(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `document_views`
--

INSERT INTO `document_views` (`member_id`, `document_id`, `datetime`) VALUES
(2, 1, 1671449166),
(2, 2, 1671449354),
(2, 4, 1671452708),
(2, 4, 1671452730),
(2, 4, 1671452761),
(2, 5, 1671452848),
(2, 5, 1671452866),
(2, 1, 1671452915),
(2, 1, 1671453065),
(2, 6, 1671453164),
(2, 6, 1671453209),
(2, 7, 1671453302),
(2, 8, 1671453419),
(2, 6, 1671453433),
(2, 9, 1671453635),
(2, 9, 1671453735),
(2, 9, 1671453746),
(2, 9, 1671453769),
(2, 9, 1671453947),
(2, 9, 1671453954),
(2, 9, 1671454056),
(2, 9, 1671454200),
(2, 9, 1671454267),
(2, 9, 1671454542),
(2, 11, 1671454735),
(2, 12, 1671454797),
(2, 13, 1671454854),
(2, 14, 1671454922),
(2, 15, 1671454964),
(2, 16, 1671455037),
(2, 17, 1671455108),
(2, 18, 1671455183),
(2, 19, 1671455279),
(2, 20, 1671455341),
(2, 21, 1671455456),
(2, 22, 1671455501),
(2, 22, 1671455514),
(2, 10, 1671455531),
(2, 9, 1671455942),
(2, 10, 1671455960),
(2, 12, 1671455965),
(2, 17, 1671455974),
(2, 18, 1671455978),
(2, 21, 1671455984),
(2, 22, 1671455988),
(2, 9, 1671456353),
(2, 23, 1671456507),
(2, 23, 1671456559),
(2, 9, 1671456831),
(2, 17, 1671456850),
(2, 23, 1671456856),
(2, 9, 1671456862),
(2, 10, 1671457019),
(2, 12, 1671457025),
(2, 9, 1671457139),
(2, 11, 1671457144),
(2, 9, 1671457452),
(2, 10, 1671457458),
(2, 11, 1671457463),
(2, 12, 1671457468),
(2, 16, 1671457480),
(2, 17, 1671457487),
(2, 18, 1671457492),
(2, 19, 1671457499),
(2, 20, 1671457506),
(2, 21, 1671457513),
(2, 22, 1671457520),
(2, 23, 1671457527),
(2, 21, 1671457588),
(2, 24, 1671461066),
(2, 25, 1671461095),
(2, 9, 1671465190),
(2, 9, 1671465202),
(2, 9, 1671465210),
(2, 11, 1671465222),
(2, 17, 1671465226),
(2, 18, 1671465231),
(2, 21, 1671465243),
(2, 23, 1671465293),
(2, 25, 1671465298),
(2, 24, 1671465302),
(2, 24, 1671469657),
(2, 25, 1671469681),
(2, 24, 1671514687),
(2, 9, 1671527072),
(2, 9, 1671527320),
(2, 9, 1671527368),
(2, 9, 1671527372),
(2, 9, 1671527439),
(2, 9, 1671527576),
(2, 9, 1671528318),
(2, 21, 1671540140),
(2, 23, 1671540449),
(2, 9, 1671546277),
(2, 25, 1671597372),
(2, 16, 1671604436),
(2, 9, 1671607154),
(2, 9, 1671607447),
(2, 10, 1671620871),
(2, 9, 1671621075),
(2, 9, 1671621192),
(2, 20, 1671621280),
(2, 9, 1671639308),
(2, 11, 1671639329),
(2, 25, 1671639342),
(2, 16, 1671682801),
(2, 9, 1671682827),
(2, 9, 1671682920),
(2, 9, 1671682953),
(2, 10, 1671682985),
(2, 9, 1671682996),
(2, 9, 1671683169),
(2, 9, 1671683240),
(2, 9, 1671683282),
(2, 9, 1671683342),
(2, 9, 1671683343),
(2, 9, 1671683376),
(2, 9, 1671683383),
(2, 9, 1671683433),
(2, 9, 1671683613),
(2, 9, 1671683757),
(2, 9, 1671683805),
(2, 9, 1671688021),
(2, 15, 1671691461),
(2, 9, 1671692454);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`) VALUES
(1, 'Sagar Darshan');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fname` varchar(150) NOT NULL,
  `lname` varchar(150) NOT NULL,
  `marathi_fname` varchar(250) NOT NULL,
  `marathi_lname` varchar(250) NOT NULL,
  `preference` varchar(15) NOT NULL DEFAULT 'english',
  `role` varchar(75) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fname`, `lname`, `marathi_fname`, `marathi_lname`, `preference`, `role`) VALUES
(2, 'Weave Construction', 'PMC', '', '', 'english', 'superadmin'),
(93, 'Mr. Ashok Rajaram ', 'Patil', '', '', 'english', 'member'),
(94, 'Mr.Shrikant ', 'Bhikaji Jadhav', '', '', 'english', 'member'),
(95, 'Mrs. Sushila', ' Bhikaji Jadhav', '', '', 'english', 'member'),
(96, 'Mrs. Shamal Dasharath', 'Nanche', '', '', 'english', 'member'),
(97, 'Vinit', 'Deshpande', '', '', 'english', 'member'),
(99, 'Mrs. Asmita ', 'Ashok Chalke', '', '', 'english', 'member'),
(100, 'Mrs. Bharati ', 'Shrikant Despande', '', '', 'english', 'member'),
(101, 'Mrs. Madhuri ', 'Mukund Nazarkar', '', '', 'marathi', 'member'),
(102, 'Mr. Mukund ', 'Tukaram Nazarkar', '', '', 'english', 'member'),
(103, 'Mrs. Indira ', 'Surendran', '', '', 'english', 'member'),
(104, 'Mr. Babaji ', 'Sakharam Padwal', '', '', 'english', 'member'),
(106, 'Mr. Balaram ', 'S. Patwa', '', '', 'english', 'member'),
(107, 'Mr. Ratna ', 'Krishnankutty', '', '', 'english', 'member'),
(108, 'Mr. Harshad ', 'Shankar Parulekar', '', '', 'english', 'member'),
(109, 'Mr.Arvind ', 'Gangadhar Vaidya', '', '', 'english', 'member'),
(110, 'Mr.Subhas ', 'Rajaram Pashilkar', '', '', 'english', 'member'),
(111, 'Mr. Darshani ', 'Dasharath Nanche', '', '', 'english', 'member'),
(112, 'Mr. Deepak ', 'Dasharath Nanche', '', '', 'english', 'member'),
(113, 'Mr. Narayan ', 'Kudda Naik', '', '', 'english', 'member'),
(114, 'Mrs. Sujata ', 'Sudhakar Dawate', '', '', 'english', 'member'),
(115, 'Mrs. Radha ', 'Sudhakaran', '', '', 'english', 'member'),
(116, 'Mr. Amit ', 'Kanuprasad Pandya', '', '', 'english', 'member'),
(117, 'Mrs. Priya ', 'Mandar Salkar', '', '', 'english', 'member'),
(118, 'Mr.Appaji ', 'Govind Vazarkar', '', '', 'english', 'member'),
(119, 'Mr. Mohamed ', 'adam jawahar ', '', '', 'english', 'member'),
(120, 'Mrs. Sheela ', 'Dhondubhau Warkhade', '', '', 'english', 'member'),
(121, 'Mrs. Sheela ', 'Dhondubhau Warkhade', '', '', 'english', 'member'),
(122, 'Mr. Ramdas ', 'Vasudev Kamath', '', '', 'english', 'member'),
(123, 'Mr. Ramesh ', 'Pandurang Sable', '', '', 'english', 'member'),
(124, 'Mrs. Sanjiwani ', 'Ramesh Sable', '', '', 'english', 'member'),
(125, 'Smt. Laxmi ', 'Dattatray Patil', '', '', 'english', 'member'),
(126, 'Smt. Manisha ', 'Mohan Satose', '', '', 'english', 'member'),
(127, 'Mr. Vinay ', 'Santram Kale', '', '', 'english', 'member'),
(128, 'Mr. Deepak ', 'Bhikaji Shetye', '', '', 'english', 'member'),
(129, 'Mr. Bhikaji ', 'Namdev Jadhav', '', '', 'english', 'member'),
(130, 'Mr. Subhash ', 'Shivram Nanche', '', '', 'english', 'member'),
(131, 'Mr. Ananda ', 'Nivrutti Jadhav', '', '', 'english', 'member'),
(132, 'Mr. Mangesh ', 'Raghunath Haraple', '', '', 'english', 'member'),
(133, 'Mr. Rajesh ', 'Shriram Pingle', '', '', 'english', 'member'),
(134, 'Mr. Malhari ', 'Dnyandeo Madane', '', '', 'english', 'member'),
(135, 'Mr. Shivaji ', 'Mahadeo Garle', '', '', 'english', 'member'),
(136, 'Mr. Narayan ', 'Dnyanu Madne', '', '', 'english', 'member'),
(137, 'Mr. Narayan ', 'Dnyanu Madne', '', '', 'english', 'member'),
(138, 'Mr. Dada ', 'Sadashiv Kolekar', '', '', 'english', 'member'),
(139, 'Mrs. Sneha ', 'Tejas Nimbalkar', '', '', 'english', 'member'),
(140, 'Mr. Manohar ', 'Dwarkadas Narang', '', '', 'english', 'member'),
(141, 'Mrs. Neena ', 'Manohar Narang', '', '', 'english', 'member'),
(142, 'Mr. Santram', ' Laxmanrao Kale', '', '', 'english', 'member'),
(143, 'Mr. Ramdas ', 'Vasudev Kamath', '', '', 'english', 'member'),
(144, 'Mr. Ramdas ', 'Vasudev Kamath', '', '', 'english', 'member'),
(145, 'Mr. Ramdas ', 'Vasudev Kamath', '', '', 'english', 'member'),
(146, 'Mrs. Rekha ', 'Prabhakar Rao', '', '', 'english', 'member'),
(147, 'Mrs. Geeta ', 'Vijaykrishnan ', '', '', 'english', 'member'),
(148, 'Mrs. Archana ', 'Anant Apte', '', '', 'english', 'member'),
(149, 'Mrs. Archana ', 'Anant Apte', '', '', 'english', 'member'),
(150, 'Mr. Arjun ', 'Keru Palve', '', '', 'english', 'member'),
(151, 'Mrs. Sunanda ', 'Shrikant Joshi', '', '', 'english', 'member'),
(152, 'Mrs. Sushma ', 'R. Rao', '', '', 'english', 'member'),
(153, 'Mrs. Sheela ', 'Mahendra Tanna', '', '', 'english', 'member'),
(154, 'Mr. Shashikant ', 'Yeshwant Lad', '', '', 'english', 'member'),
(155, 'Mr. K. Ramachandran ', 'Nair', '', '', 'english', 'member'),
(156, 'Mrs. Sharda ', 'Vijaykumar Iyer', '', '', 'english', 'member'),
(157, 'Mr. Gangadhar ', 'B. Ghurde', '', '', 'english', 'member'),
(158, 'Mr. Pradeep', ' C. Roongta', '', '', 'english', 'member'),
(159, 'Mr. Vilas ', 'Ganpatrao Deshmukh', 'विलास', 'देशमुख', 'english', 'member'),
(160, 'Mr. Vilas ', 'Ganpatrao Deshmukh', '', '', 'english', 'member'),
(161, 'Mr. Vilas ', 'Ganpatrao Deshmukh', '', '', 'english', 'member'),
(162, 'Mr. Vilas ', 'Ganpatrao Deshmukh', '', '', 'english', 'member'),
(163, 'Mr. Vilas ', 'Ganpatrao Deshmukh', '', '', 'english', 'member'),
(164, 'Mrs. Tarabai ', 'Bhau Khutal', '', '', 'english', 'member'),
(165, 'Mr. Khunkhun ', 'K. Yadav', '', '', 'english', 'member'),
(166, 'Mr. Pradeep ', 'C. Roongta', '', '', 'english', 'member'),
(167, 'Mr. Ramchandra ', 'Mohaniraj Kotasthane', '', '', 'english', 'member');

-- --------------------------------------------------------

--
-- Table structure for table `user_authentication`
--

CREATE TABLE `user_authentication` (
  `id` int(11) NOT NULL,
  `password` varchar(1000) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_authentication`
--

INSERT INTO `user_authentication` (`id`, `password`) VALUES
(2, '$2y$10$7PySBECiMPEorlMCX/Dy/OEMsw5rigMfAa3mW6SXgiZtGELBsCcAm'),
(13, '$2y$10$kZ3VuyiqtiX6ISJHsVH0Fuz3UnEuev2dXcykGuwAMID.0SzZqhB.q'),
(12, '$2y$10$vt4R4BpyytAa5K/c59q3QuvmllpdvdXJTSr6.A00ylhq2/P5qJNIC'),
(14, '$2y$10$HJzcKxPEpXG.p.Fx.IRdl.TtWeX.rPuauZRW3jLOnQ0ZfYleF3rbG'),
(15, '$2y$10$9MoQ8n4L09/IopV.YUmgIOblCsl.9Fl2Ne7GPbhCIgFx6ItN22j3G'),
(16, '$2y$10$9EOlUC1PBqmyJjeSu.ApTedULeZqRofD.HltKWJKPQ.BnF7M2xRkC'),
(17, '$2y$10$dhpmfSnoTD/vj444HP3XMu/yyUpzMiNtYZCLgqPSugAvGHYe7a4P2'),
(18, '$2y$10$nACK0YrwxbxMn0Zgg7obuu201Q/kHJ/UHZW6S4yFLxN2mEexuLuwe'),
(19, '$2y$10$HduzuO9iHGnOdg5WHwhGQu/Mv1uyfBZRFRuZekYtJO077/6Us5coC'),
(20, '$2y$10$WgxMEfNJeRwx3rdCvCuWvO9BT200yza6/3JD2oJdj6SPd1ADLNPMG'),
(21, '$2y$10$bR4dazFX/5TAswySjs/Ky.nNUltn0F094CbRQv3YVFD2DYRkVgnM2'),
(22, '$2y$10$becM01JZjkaoo.mafJ2/rev82797Px3VWmDVXcLxjDRJUYaUMmhIO'),
(23, '$2y$10$EBoXiP2QTVDp/QpI7AGmoe8QSphU4ilomoyalcqtLmaaulZazWVlO'),
(24, '$2y$10$VcvithXxFFlYe1GXz22tHe9ZySf4UZjmbeoMCF3DZHXh.st99r9AK'),
(25, '$2y$10$b5tj3kLv0hkeYQ/T5qpJg.AFMdM.W5MrbfygbPsYlxjnGJ7ngle5O'),
(26, '$2y$10$5oNeXp1HkTVnC13KbtyvJ.BzCDwzj0ZtzEtE/LQNShGPN2nEDp29K'),
(27, '$2y$10$1cbFD7zCCfXPZOJHVu4IHea.YKfjLxAfmedGNxJ4XeVYg9E6UvtYW'),
(28, '$2y$10$.AZOkcbfMTXE3a7qpIUsAeaiYWOdTAOFrqgkZorBRTRgil48x9jRa'),
(29, '$2y$10$/UFr/ZR4O9V357IhHP4UYu3jo2xevKDah6EpLr7GWtyoztNSpr9Oe'),
(30, '$2y$10$lqE8XxRPOfmebtxf0bE1JupJ9grhEpNOP.1XvOtnZ1HAMqipL0bNe'),
(31, '$2y$10$SM6Q838acqRSpTM1vtbWLOLBWlKxRN/NiXIhzLr15t1pFWjJxyxXi'),
(32, '$2y$10$CBsEbUA1ez6Fo9xemHVATekyg5tBW22ERUBZNto.ra6AFCmP5e9TW'),
(33, '$2y$10$SSQGeUCUxtcO4rAIzB2aOegjHDhlubB61HYS3WO/M/WgQHlf2HURa'),
(34, '$2y$10$Rg5XTt1DVYBBWbyrNvsVveSl8XElTdAJ4nZpjM2vHYGoMshfxWuQu'),
(35, '$2y$10$sQ0gn8kkxsdddzmjEV9Zbu0OfbP0Xi3d76MfUo64KcSxSkzvQBzna'),
(36, '$2y$10$Fosw0u3mFZKwCKUJcwXEgOQDm3rGe6BSmbHvGtDlSB6Rj0uBxoo/C'),
(37, '$2y$10$RKqINoH.LOM5gfJcXCNGL.mLTMHOmo2YNcIUymfBdY5nBltY1IP2i'),
(38, '$2y$10$lxm3hTdvjOLReeLUXhPu.OaleB7DsNj50jDNfMz6tul82nrD2Mcru'),
(39, '$2y$10$ZaK0ZpdMMzyv4hPoxmjzgupDFBmsvYB3jGYTfhCtvNrQpHsHsIw/O'),
(40, '$2y$10$oJTFXU8veTwRdXjdP8dyiuf5Wcl70hfciXWp/WMHioQq8dSkiyNYS'),
(41, '$2y$10$jaTua9mvAwTPdJQBQl88Ie3M3dwQg2bo4N60ImvMwXvMk2zCz9bMG'),
(42, '$2y$10$yIKlloX4U3APCwnNRfCSXeUIWUb1IZiJBpNwD4LaPIUhy6/2cn5ia'),
(43, '$2y$10$GVY8KwoUq.eWmp98W.nGyubfv.bhXrng/vZfl1IkoxYUVlB7749WO'),
(44, '$2y$10$tSMqxwk3jQedSO96Z7O/peu7r7.zfmMIWDLmGTENDBfMH5WyPdEvC'),
(45, '$2y$10$YS31HDAL98OzE23qgvLB.On5XEbcJrmPlRTQlhN8cRbBUakTbOWO2'),
(46, '$2y$10$SenjlPxkz.8QTJU6CTkmo.UHOKA1YhI7F5AGXmH5KShPZYRmrNKP6'),
(47, '$2y$10$GPdXx0/hFTizFVN2QMLG2.mN3LzMOG4m1vv8aaX7YpY7PGMMib/me'),
(48, '$2y$10$JoXQugRseg2c2yc1.tX0wung4H2KMScxMU.JjtQoM.j66r3CIQ0sm'),
(49, '$2y$10$58zYvXpL9met96r1sq3ccuRhqEBtRzFWd0NPr7.8l/XXQaImMq1Em'),
(50, '$2y$10$MHjNYTeWUOrKNC/Y1p9NLuZPX16ZFHN65cpVQe7MeCB/x0ZNQlAxe'),
(51, '$2y$10$GJquCpgcYQT1U2PNBbrZNOfoechoElrR8tAOtdZ5XoUrPeuPLfd0m'),
(52, '$2y$10$PT2QEB30Eupbq/0Ib5bLRegAXzhKS5Xm83N4yaoGjaWtiXpm33.X.'),
(53, '$2y$10$1xPGGKgNI/FIZRUO.5qNtu8dsOJuf2HJtPzonIj67mXHrmLmqUpii'),
(54, '$2y$10$3500fD.Wrn06TK1mQYHrfO.c2eFDWXxJvC/BP0sEqeF0n5qpmDzje'),
(55, '$2y$10$/maKgeRiNfYa5/JV3.lTluKS/M7zHNmwcqZzXMfLM3NMkXN6H97Ey'),
(56, '$2y$10$8PsjDAVbdBZyfDP0.Ka4p.ewS0Bo78mV9qiBCOq9a81Om0G.9QXm.'),
(57, '$2y$10$9FgUAz8LpZwzXtwywaGTS.D42eBTXrA0cxXwoa5eZ1Snn4rM3jCBS'),
(58, '$2y$10$vvrDYpfjyvsIBUUA6g6M4OsNoelnqQFVKjLFsMSdXLRP3DCbLvvYS'),
(59, '$2y$10$T1eimXqSdOYI2/8MoHF1leDJ1JlFtORZUNS25y3Q4a3s3m74tBLXG'),
(60, '$2y$10$DA9NZ8qhjlRvtNrwR8Ex2.RmqedxzI.wXDiWiJX.eSvqIOzfq/wfG'),
(61, '$2y$10$esd6lcyb0Ia7UDtxH2kY0OR0fRUodwYc/1ekajfuMEM/FCH//qCtS'),
(62, '$2y$10$8BZQK.9mt0AULTFeTo5gru3yLPg5smH0uq3mCRcWN2CQuph8NQV.6'),
(63, '$2y$10$jJJSs9RB6oPS5VkSJQOKo.WIjFEiXAAXbVOU1DXRbWUktl39dCX3C'),
(64, '$2y$10$hnJi0qIF7f2fEqYle73/UeusLPFdjm180YRLGDDEX41pM1nZY1tSS'),
(65, '$2y$10$nSTdJyCCKtLno2vFr9/q6uHNrIhBYf//6pCLz93hj04rAK6z/c.v6'),
(66, '$2y$10$Lz1YUFoICv7A7ynpA2d7lOaFoI8OA9Ov2137oPetVRTwr0KZuWj5C'),
(67, '$2y$10$FmCqyaEpu0/az9.QZ8JGu.P49a.yvkU9EvJQh4io.bRZ7XICIVw4K'),
(68, '$2y$10$.qKIlyol5yetmvsE5.68uukvHcN094qKEN9OkHWZYb9e73u1FjPlO'),
(69, '$2y$10$nfHV/Yxl4AVuyWzzuK9QT.E1ivsxz9.scIsTY0t/Uf7J8lXXGmX5K'),
(70, '$2y$10$QlZJJUD1RmE6LCVKrPri6OtbPGHSiSGwpDPEAS4sG.1LzzgjEYB86'),
(71, '$2y$10$O9I2JON4ITOPuy63cZakLOSYTO0V77D6ZzbtS4F377GPGINkb.146'),
(72, '$2y$10$AMA4SY54pp3ExoHWq6pkDOLPnax5wAxg4ONggAesSbp12736wQv22'),
(73, '$2y$10$5e.1D0iVBR7vv1sQedDL0eBzidbfQeoYmQA.APT503UKBNxGpRQqG'),
(74, '$2y$10$VV.MYwhuqgR/QNX4cvt6m.yyHUvdb547fUvuCPOVLVuPaMhkKCe1S'),
(75, '$2y$10$CgCVVHmc4IEpKEvaDsUetunAkCXAx0rDJox1E6/l.BvU5HibLq93K'),
(76, '$2y$10$OVLaGwZqeecIAWpBbCvoc.Ks/fgKlJK3xK8UmK6r6dgzTxpODQaGe'),
(77, '$2y$10$111qNrgsws0TDWnC5yCl2eY4N80kDTVJyyRcTRnbIlc0X2z7Q8WUq'),
(78, '$2y$10$MN1ybysyv0N3JSsLmvAUn.ef0sw3Kn5K8baTPsEZ0qm5fV.lruhaS'),
(79, '$2y$10$fsy2hTMUkyPO3E6FVf15y.iqmSdNJ4tYmsbO1.HZ5mUrUsmel1XUy'),
(80, '$2y$10$PalcM1eVGv.vRA9cTNOGve14r0BgznKN/Cal5PSp9p5VYrEyxXn0a'),
(81, '$2y$10$N4W74CR.vqJLjGBGTsbvCumAUkFQachdhfKaZjK6GtBDiZ3wVrZ6W'),
(82, '$2y$10$DBdfPL4IsQ4jIp1xQjMlt.lqYV7yc094jetLQvQTWhb4TOjNNyjh.'),
(83, '$2y$10$whESOcNvwTX1VDA7XoGWReksT3B8ugVmYa0AzyLsJx5NBzSNqqbG2'),
(84, '$2y$10$JgIjkls55Y7XZvZdrnHfDOqjJ47AsLMBZOIfVFBIlYjewG6G/DqZi'),
(85, '$2y$10$6d1VYkyPEeo6B.BHYaT0dOFxx3AssTXgvftrPxLXjOvhCEBgW05V.'),
(86, '$2y$10$4KOICgo5yMiJOnvHdBkVJO48xWH4kTUIsKMQXfwyt0xtzgZx4.Nqi'),
(87, '$2y$10$tqCp1lyWOTZUVdhXQqw9BeRAOmASkpcuQxhTVrOAGBdCN76UdWle.'),
(88, '$2y$10$xDF39F0m/GpRUzOgjDfAB.sgcTeDDpkXKaPLSWR92BwFyVGG60Vxy'),
(89, '$2y$10$7N/YwjKgpWCwYEbFBOt2kurSvaMXY3mpCzRRcQa9nTv.6tueBY/S2'),
(90, '$2y$10$GbvKBtLxnQxfB3UJjSJIbOfoGHULMPaOvFBESzmSVbcTh6LKtkeeu'),
(91, '$2y$10$kEZsJXFB7GxUiIMMmE5e5OYut4Rlzysiv22t1i64nYd8/7wn/KOFi'),
(92, '$2y$10$45EDTj680IcLICEnh7H2j.YbW5PqUxXmBKjVk2h2mEiAs8QZIPz/S'),
(93, '$2y$10$EoJL855JXDlxb5DCew57Su0845geDfismH3WIXY6S771CXgn5rToO'),
(94, '$2y$10$GmfKmDRoAycvQ87mckwIOuqySLzfKxhHt2V3xEJCYzknRElDbt4nS'),
(95, '$2y$10$gbw/DSB3ZK.WgDkVKGE3S.YEvqwu.KvujU29Gv4G0czxF3GvmQyp6'),
(96, '$2y$10$Yvz9Sv/biSVu6kkm8fUB8.0o/.EhsK.mbbD6t9iVgnPqAJLaL7XFK'),
(97, '$2y$10$Tlo.xF2wIvrRAHJrwjEv3.K36Qulc8xBM7D7NtBNY63JmerrT.4fK'),
(98, '$2y$10$r7qHSQhXT5/amLCWbOlFc.4Gp8GnjPqimo4TNvOGENEMvIcwURZj6'),
(99, '$2y$10$6794MpkVGdTtoIb8VqnmMOpjPTv5WnjwNqhsbec1zZJIyj3sg.f1K'),
(100, '$2y$10$RnooKd/5VOIZrthJeEKzo.33/eU.hut5KpVNqMLcDCxRCXcszua9m'),
(101, '$2y$10$Yi3tjJWxPUAqY4Fqp25Hqu6qifFKunzu0ZnpK6pBpqx8tIFT2tdse'),
(102, '$2y$10$WA8K2w/xag4w7lGkVjbxleFPOzM7XW8jyuNDvyHV0ov18yUJvdg66'),
(103, '$2y$10$ECYI6dkzjSALVmRtlJ7HgeFu05YZ/4kD7dJAgKU8Osq7kXTOUjDWa'),
(104, '$2y$10$YFaKFKQtp3BlRTsEURuI7.5641LY5bTm/jF.GJjVxmU8E/BJ7zyYK'),
(105, '$2y$10$J79BduXY78KPfIEEjnKa5eAz/dzuWY5/ROH8nPIr2GTG5yVyquCRm'),
(106, '$2y$10$VPGf3XvYlDDFyVXhYBk4auTT8UXXQvPesQiGFfWi8qs1aL4hLcu8a'),
(107, '$2y$10$Z/dzfhchB3nZFW56mziV0eDdRhH29Lwp7l4a/cPvHxsag43nQfI.O'),
(108, '$2y$10$VTu2Cx.22WbovAZHLbJQVu2E/0vBHPyZnLvGgZM31azHyTeG9g8tC'),
(109, '$2y$10$l1it4iq0dZXxZaprfd9ztOgsqUsuzydkirdcA6rUwj5E9PqOEU9Ie'),
(110, '$2y$10$YmG23YcmyDjigT2nzvFZS./JXgwB1jUl/6fkPkIiU..xu3waooPem'),
(111, '$2y$10$RiFbnaOYqWVzAHRDpJX6T.1o5V/loZrbGrSQGqkyNbS57c2MTloYq'),
(112, '$2y$10$0BsAq.z2aQ7gGJzZknAUVeezGPFVB5Ib2OiWmsT7LDRTHwfgD9oC6'),
(113, '$2y$10$buRG0XV9o3pHEOBzBCuHCeLV35OWpZkYaSs7FGJHWRWjuYjis4m2O'),
(114, '$2y$10$7InCVdc6MvgC2QRYNDDbgOU2hBkiQd05.gXLFrcX7PCU0YVEeAOUu'),
(115, '$2y$10$wETNZfPmN9LnOdKcKOsfTe3USSKMd3RJJnT5eeTa49QCmBsRGn64.'),
(116, '$2y$10$KtTdUJF5DBPzBaQ8rZrP..L/SHnlNGvsCrAh.HXntNnRWgeqMc6c2'),
(117, '$2y$10$s9IWDU0EvyU6MNU.khlDyuqA3nnB46Ni/h/4IbZF5CpgYig5k7NFO'),
(118, '$2y$10$1kiv63RNEvc7Tw7axae9ReN1siiXlvgbp4U2yq7EpS73sazXV6cpy'),
(119, '$2y$10$892N//.fHB1PAyPlxDl.fOsyLxyjs5hsktQLqxM/EWgGcP6DwzJYi'),
(120, '$2y$10$WUOtGGA5CCTgJSLNhsLMPOvGNYAQOh9UQ6PZGIBwOhrEAWKyFsPh2'),
(121, '$2y$10$HjXA7ILpbbvGvhPjbOjfKOWmGmTDVJyCCnEOneVOndjOjBCIeEvSC'),
(122, '$2y$10$jyz4NKrfZiVeM93vWHMD3eaIUMCJtn0p.wgbPngMBTy4WA1JfM3Yi'),
(123, '$2y$10$0rut6wdq275MYtyLy8oq3O3W5an3yCNIRbP8oz6WSbXq9lzfTpCFC'),
(124, '$2y$10$oJJi7SwPDdTr4BQKWXvC6e4cGamooPRVHyWyZsbX.kzMbGYOPoNgS'),
(125, '$2y$10$02IzA45AoHf5pcm6ZO9tr.atD4RIYEnYrPxb5lUBuS/c/DnAthaxO'),
(126, '$2y$10$Qi/ZP3ej2yqCg6k.xM6vQ.5kDtGp8MV/0cD8MC6vXU0AYuY0UB3.6'),
(127, '$2y$10$hdPt4wYX9s7AZdEq.rMq9umO9jdBiyzneHihAbok6r3Yh82WWO8zq'),
(128, '$2y$10$HaY9IeEegFSXu4edZTp7iuc.atzszpkwPwea.meVJreyswBRNUhlu'),
(129, '$2y$10$NknY/cWU.Q3xThOCcMDn8OVpC7kCSFbuyR./DKWnUCDEXp0mu8Jw.'),
(130, '$2y$10$az65YExgC8ApKtLR52DVIOU4Lnh3BzP/SupuUoOzZ0IHGWB9GclpO'),
(131, '$2y$10$spUs99mk7Fhm4smsKAPZEOLMTObBORLENQesD1KQIXCJk7fSL8UU6'),
(132, '$2y$10$6PIwcdNN6JhqjuBllevkbOfmXuf7rvE2A4/m/RrD5auTIexplowQe'),
(133, '$2y$10$.wWp7OgOvSlzvIQc.584YeSJQyRK.RCGXStcfG1THyxZphsZcsMZm'),
(134, '$2y$10$yUFQ5GqY19QVbdE3tDEjZOQNMO.eMmnVfktPga1AZu6TofJ0PxDSy'),
(135, '$2y$10$ub1YPO6RxVJnFqsk97GPdeIdsf7tCwxRhzcRpgXV6SHYfPVvvv37O'),
(136, '$2y$10$h/c/Qs5gbpecDqneNuRa1OHrdNAlOFqbBgMJGSapHAlJqT7jP8ra6'),
(137, '$2y$10$J9efly8/u/4kuWQhYPwcYO/ukS3g3sI4CqthOxzEf9PzhuWW8NqyK'),
(138, '$2y$10$YJWQd738FNu0nrDTdfIuPOm.nXzDLqN/VQ5QWBXvJJIHD8TYL/Ib2'),
(139, '$2y$10$zrjR.ylYbi2x7TWIz69plO22N3Hzi89Pib1PCGYNdgnEF7k4J6LyO'),
(140, '$2y$10$0WR6DqFV7QxPqXb4y9V8aO74X1cK7DBgDszL76ty8sXgGFzNdkI.C'),
(141, '$2y$10$1vt8ysqmxpvZTl7Ht07o5u28QXpNxrpFMSeW8NR8NQMEKUoRbvkba'),
(142, '$2y$10$DMA80PS089Xj.qwybybyY.p5C3G4gfFN3Empi9Tqu9IPjfezgBWTa'),
(143, '$2y$10$QHguJIJJ.FF5ckVhUPWNzu8BQQQ1Ptm2.rHepSXR/TGC/2pYBw7TW'),
(144, '$2y$10$OTJr1enPkzBkgf.wUjSTz.eL11gn7Nlm1dZPjzz1UN3P/5WnH7yPy'),
(145, '$2y$10$NaUgYmz1N.r5yEtGBk8PCenY6w/j6pEx1EapnuJ/7f8vawCKv3MjW'),
(146, '$2y$10$qCbgvX1kR1eUZeIIkWG1LehOSrHt2vfhpxj5ZCdcGIQFxFaBgvRyK'),
(147, '$2y$10$4EiyUqA3D3ryCzOBMrka/eGnVrhT8uDebdVclla5tz301uTaR465q'),
(148, '$2y$10$.EpejQLbQrvr/IoXHAZLVOA3E8mfs6SWOgV1tXTrbyZPRVurmi1uu'),
(149, '$2y$10$JcDpBJTbqqQLO3JzMlHUsuhsfkTmP0D2uXoqfuo.iOvA0coXDFT5K'),
(150, '$2y$10$v3LnEWE6yjAdeZsgtJQqseX/Rl5RVBRAQ.E.4okNs754mKmS6X7EK'),
(151, '$2y$10$ko.tqGQOV0VeD0TEyo26nuY5djwzxk6FfYqLJP9W16SSqn4DDKTw2'),
(152, '$2y$10$awJjxlWGgNvECk9tWEu8seQMtESnunsM9A.qn9hHFeKzi/RWTWpia'),
(153, '$2y$10$FC/fx6wnmYmj2O9fuxLAte5kN4NMnAEtro85KtPq/IJaSbS2FnqFa'),
(154, '$2y$10$DQYp0tuEWr620ygyKQOIzuCbLWDkX4G/gAM5xFhiREMm8IW6N6t66'),
(155, '$2y$10$WFDLbPTTfFU/fv2D.FzdOecW02C/Ay1.EKLZsLjW79j8JWgRky21G'),
(156, '$2y$10$Vss2ciermQv.ArkbaeVOgeyiNOdwCyRNBcePS3E/btMvUfnSu4iKe'),
(157, '$2y$10$4u5rUzlckzxqP9Xk3xPsLuvQJBAp02NYdjpSvZz2j/D90QxyE38ju'),
(158, '$2y$10$KLAVJ0fickkiOjRw81E22uH9DebHWoU9.kTgglf31BdjghYVAVyA.'),
(159, '$2y$10$vY4u9GBOKwnWoCEFi.MZ..5D.G..Mh19Y6Ui5akxUVTYT.adygvcG'),
(160, '$2y$10$xWxJEyzIwczhzDct2Vw6V.NHSMunLI4EMdzNhazkA8j39DPa.YbCW'),
(161, '$2y$10$87pPMPdFS7sc8MZzTA2pGOE.KllMOLv/0I8fhGYBtW/OMi/rN86eS'),
(162, '$2y$10$sOxedDk/iHTN9KMYtRnqMuWzoVrX7DiGsBGQkwkRBQegIkRG0TWki'),
(163, '$2y$10$iv8lhM56grNAnmG4iRrRquZMMiatao0/GR4gBh1iXE2cD6kS86bHa'),
(164, '$2y$10$neKD5qfazo1dYQVgLbNev.h/xfLhhsr4zwsQ4zSqh7.5zQhhr1YKe'),
(165, '$2y$10$APf/KTzHbGQOfZNIG7rjpOrHM3CjP/SH1O3P4J.oRq2OtZAayC86m'),
(166, '$2y$10$JEz/USstwTmVY1PJ6/ZjN.qw5eWe94IOJmJWVvBeK0bsnt2fzFxnC'),
(167, '$2y$10$WlFDopSSBa46vn5cKzTI5OO17Iw7xiJzucaGNUaShYZ1EMbD0ZVMm');

-- --------------------------------------------------------

--
-- Table structure for table `user_contact`
--

CREATE TABLE `user_contact` (
  `user_id` int(11) NOT NULL,
  `contact_type` varchar(50) NOT NULL,
  `contact_detail` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_contact`
--

INSERT INTO `user_contact` (`user_id`, `contact_type`, `contact_detail`) VALUES
(92, 'email', 'nupoor@gmail.com'),
(92, 'phone', '123456780'),
(2, 'phone', '9930480430'),
(2, 'email', 'weaveconstruction@gmail.com'),
(13, 'phone', '1234560'),
(13, 'email', 'shrikantjadhav@gmail.com'),
(93, 'phone', '8108112090'),
(93, 'email', 'patilashok1611@gmail.com'),
(94, 'phone', '9819440833'),
(94, 'email', 'pallavi15ja@gmail.com'),
(95, 'phone', '9819940250'),
(95, 'email', 'jadhavshrikant@gmail.com'),
(96, 'phone', '9987936249'),
(96, 'email', 'shamal.nache@gmail.com'),
(97, 'phone', '9820551923'),
(97, 'email', 'deshpvi1@gmail.com'),
(98, 'phone', '8108112090'),
(98, 'email', 'patilashok1611@gmail.com'),
(99, 'phone', '8291013570'),
(99, 'email', 'saurab2381@gmail.com'),
(100, 'phone', '9967834663'),
(100, 'email', 'bharatdesh61@gmail.com'),
(101, 'phone', '0'),
(101, 'email', '0'),
(102, 'phone', '0'),
(102, 'email', '0'),
(103, 'phone', '9594013293'),
(103, 'email', '0'),
(104, 'phone', '9930748594'),
(104, 'email', 'swatipadwal0912@gmail.com'),
(105, 'phone', '9930748594'),
(105, 'email', 'swatipadwal0912@gmail.com'),
(106, 'phone', '0'),
(106, 'email', '0'),
(107, 'phone', '9820260358'),
(107, 'email', 'ratnakrishnamurthy@gmail.com'),
(108, 'phone', '0'),
(108, 'email', '0'),
(109, 'phone', '0'),
(109, 'email', '0'),
(110, 'phone', '0'),
(110, 'email', '0'),
(111, 'phone', '9987328936'),
(111, 'email', '0'),
(112, 'phone', '8169242886'),
(112, 'email', '0'),
(113, 'phone', '0'),
(113, 'email', '0'),
(114, 'phone', '9892583172'),
(114, 'email', '0'),
(115, 'phone', '0'),
(115, 'email', '0'),
(116, 'phone', '9320670177'),
(116, 'email', 'mtpandya802@gmail.com'),
(117, 'phone', '0'),
(117, 'email', '0'),
(118, 'phone', '9819244840'),
(118, 'email', '0'),
(119, 'phone', '0'),
(119, 'email', '0'),
(120, 'phone', '0'),
(120, 'email', '0'),
(121, 'phone', '0'),
(121, 'email', '0'),
(122, 'phone', '9821133991'),
(122, 'email', '0'),
(123, 'phone', '0'),
(123, 'email', '0'),
(124, 'phone', '0'),
(124, 'email', '0'),
(125, 'phone', '9833631144'),
(125, 'email', 'welgrowexpress@yahoo.com'),
(126, 'phone', '0'),
(126, 'email', '0'),
(127, 'phone', '0'),
(127, 'email', '0'),
(128, 'phone', '0'),
(128, 'email', '0'),
(129, 'phone', '9819940250'),
(129, 'email', 'jadhavshrikant@gmail.com'),
(130, 'phone', '0'),
(130, 'email', '0'),
(131, 'phone', '0'),
(131, 'email', '0'),
(132, 'phone', '9220144211'),
(132, 'email', 'mangeshharaple1960@gmail.com'),
(133, 'phone', '9870775527'),
(133, 'email', 'Pinglerajesh27@gmail.com'),
(134, 'phone', '0'),
(134, 'email', '0'),
(135, 'phone', '0'),
(135, 'email', '0'),
(136, 'phone', '0'),
(136, 'email', '0'),
(137, 'phone', '0'),
(137, 'email', '0'),
(138, 'phone', '0'),
(138, 'email', '0'),
(139, 'phone', '9820727006'),
(139, 'email', '0'),
(140, 'phone', '0'),
(140, 'email', '0'),
(141, 'phone', '0'),
(141, 'email', '0'),
(142, 'phone', '9137388244'),
(142, 'email', 'slkale1951@gmail.com'),
(143, 'phone', '9821133991'),
(143, 'email', '0'),
(144, 'phone', '9821133991'),
(144, 'email', '0'),
(145, 'phone', '9821133991'),
(145, 'email', '0'),
(146, 'phone', '0'),
(146, 'email', '0'),
(147, 'phone', '9167378530'),
(147, 'email', 'vkgeeta@yahoo.com'),
(148, 'phone', '9082954585'),
(148, 'email', 'aptefamily205@rediffmail.com'),
(149, 'phone', '8779080487'),
(149, 'email', 'amolapte59@rediffmail.com'),
(150, 'phone', '8369022293'),
(150, 'email', '0'),
(151, 'phone', '9869544457'),
(151, 'email', 'shrikantjoshi27553@gmail.com'),
(152, 'phone', '0'),
(152, 'email', '0'),
(153, 'phone', '9892146324'),
(153, 'email', 'sheelatanna30@gmail.com'),
(154, 'phone', '0'),
(154, 'email', '0'),
(155, 'phone', '9833385642'),
(155, 'email', '0'),
(156, 'phone', '8369157405'),
(156, 'email', '0'),
(157, 'phone', '0'),
(157, 'email', '0'),
(158, 'phone', '0'),
(158, 'email', '0'),
(159, 'phone', '981235640'),
(159, 'email', 'vilas.dekhmukh@gmail.com'),
(160, 'phone', '0'),
(160, 'email', '0'),
(161, 'phone', '0'),
(161, 'email', '0'),
(162, 'phone', '0'),
(162, 'email', '0'),
(163, 'phone', '0'),
(163, 'email', '0'),
(164, 'phone', '0'),
(164, 'email', '0'),
(165, 'phone', '0'),
(165, 'email', '0'),
(166, 'phone', '0'),
(166, 'email', '0'),
(167, 'phone', '0'),
(167, 'email', '0');

-- --------------------------------------------------------

--
-- Table structure for table `user_room`
--

CREATE TABLE `user_room` (
  `user_id` int(11) NOT NULL,
  `current_room_number` varchar(50) NOT NULL,
  `current_wing` int(10) DEFAULT NULL,
  `new_room_number` varchar(50) DEFAULT NULL,
  `new_wing` varchar(10) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_room`
--

INSERT INTO `user_room` (`user_id`, `current_room_number`, `current_wing`, `new_room_number`, `new_wing`) VALUES
(2, '501', 1, '504', '2'),
(16, '102', 8, '', ''),
(15, '102', 8, '', ''),
(14, '102', 8, '', ''),
(13, '001', 9, '', ''),
(12, '1', 1, '', ''),
(17, '102', 8, '', ''),
(18, '102', 8, '', ''),
(19, '102', 8, '', ''),
(20, '100', 7, '', ''),
(21, '2', 8, '', ''),
(22, 'S-5', 8, '', ''),
(23, 'S-6', 8, '', ''),
(24, 'S-8', 8, '', ''),
(25, '101', 8, '', ''),
(26, '103', 8, '', ''),
(27, '104', 8, '', ''),
(28, '201', 8, '', ''),
(29, '202', 8, '', ''),
(30, '203', 8, '', ''),
(31, '204', 8, '', ''),
(32, '205', 8, '', ''),
(33, '206', 8, '', ''),
(34, '301', 8, '', ''),
(35, '302', 8, '', ''),
(36, '303', 8, '', ''),
(37, '304', 8, '', ''),
(38, '305', 8, '', ''),
(39, '306', 8, '', ''),
(40, '1', 8, '', ''),
(41, '2', 8, '', ''),
(42, '3', 8, '', ''),
(43, '4', 8, '', ''),
(44, '5', 8, '', ''),
(45, '101', 8, '', ''),
(46, '102', 8, '', ''),
(47, '103', 8, '', ''),
(48, '104', 8, '', ''),
(49, '105', 8, '', ''),
(50, '201', 8, '', ''),
(51, '202', 8, '', ''),
(52, '203', 8, '', ''),
(53, '204', 8, '', ''),
(54, '205', 8, '', ''),
(55, '301', 8, '', ''),
(56, '302', 8, '', ''),
(57, '303', 8, '', ''),
(58, '304', 8, '', ''),
(59, '305', 8, '', ''),
(60, '401', 8, '', ''),
(61, '402', 8, '', ''),
(62, '403', 8, '', ''),
(63, '404', 8, '', ''),
(64, '405', 8, '', ''),
(65, '1', 9, '', ''),
(66, '2', 9, '', ''),
(67, '3', 9, '', ''),
(68, '4', 9, '', ''),
(69, '101', 9, '', ''),
(70, '102', 9, '', ''),
(71, '103', 9, '', ''),
(72, '104', 9, '', ''),
(73, '201', 9, '', ''),
(74, '202', 9, '', ''),
(75, '203', 9, '', ''),
(76, '204', 9, '', ''),
(77, '301', 9, '', ''),
(78, '302', 9, '', ''),
(79, '303', 9, '', ''),
(80, '304', 9, '', ''),
(81, '401', 9, '', ''),
(82, '402', 9, '', ''),
(83, '403', 9, '', ''),
(84, '404', 9, '', ''),
(85, '404', 9, '', ''),
(86, '402', 9, '', ''),
(87, '0', 0, '', ''),
(88, '0', 0, '', ''),
(89, '0', 0, '', ''),
(90, '0', 0, '', ''),
(91, '0', 0, '', ''),
(92, '1234', 7, '', ''),
(93, '202', 7, '', ''),
(94, '001', 9, '', ''),
(95, '002', 9, '', ''),
(96, '102', 7, '', ''),
(97, '103', 7, '', ''),
(98, '202', 7, '', ''),
(99, '003', 9, '', ''),
(100, '004', 9, '', ''),
(101, '101', 9, '', ''),
(102, '102', 9, '', ''),
(103, '103', 9, '', ''),
(104, '104', 9, '', ''),
(105, '104', 9, '', ''),
(106, '201', 9, '', ''),
(107, '202', 9, '', ''),
(108, '203', 9, '', ''),
(109, '204', 9, '', ''),
(110, '301', 9, '', ''),
(111, '302', 9, '', ''),
(112, '303', 9, '', ''),
(113, '304', 9, '', ''),
(114, '401', 9, '', ''),
(115, '402', 9, '', ''),
(116, '403', 9, '', ''),
(117, '404', 9, '', ''),
(118, '001', 8, '', ''),
(119, '002', 8, '', ''),
(120, '003', 8, '', ''),
(121, '004', 8, '', ''),
(122, '005', 8, '', ''),
(123, '101', 8, '', ''),
(124, '102', 8, '', ''),
(125, '103', 8, '', ''),
(126, '104', 8, '', ''),
(127, '105', 8, '', ''),
(128, '201', 8, '', ''),
(129, '202', 8, '', ''),
(130, '203', 8, '', ''),
(131, '204', 8, '', ''),
(132, '205', 8, '', ''),
(133, '301', 8, '', ''),
(134, '302', 8, '', ''),
(135, '303', 8, '', ''),
(136, '304', 8, '', ''),
(137, '305', 8, '', ''),
(138, '401', 8, '', ''),
(139, '402', 8, '', ''),
(140, '403', 8, '', ''),
(141, '404', 8, '', ''),
(142, '405', 8, '', ''),
(143, '104', 7, '', ''),
(144, '105', 7, '', ''),
(145, '106', 7, '', ''),
(146, '201', 7, '', ''),
(147, '203', 7, '', ''),
(148, '204', 7, '', ''),
(149, '205', 7, '', ''),
(150, '206', 7, '', ''),
(151, '301', 7, '', ''),
(152, '302', 7, '', ''),
(153, '303', 7, '', ''),
(154, '304', 7, '', ''),
(155, '305', 7, '', ''),
(156, '306', 7, '', ''),
(157, '101', 7, '', ''),
(158, '002', 7, '', ''),
(159, '001', 7, '', ''),
(160, 'S - 001', 7, '', ''),
(161, 'S - 002', 7, '', ''),
(162, 'S - 003', 7, '', ''),
(163, 'S - 004', 7, '', ''),
(164, 'S - 005', 7, '', ''),
(165, 'S - 006', 7, '', ''),
(166, 'S - 007', 7, '', ''),
(167, 'S - 008', 7, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `wings`
--

CREATE TABLE `wings` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `type` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `wings`
--

INSERT INTO `wings` (`id`, `name`, `type`) VALUES
(8, 'B ', 'old'),
(7, 'A ', 'old'),
(9, 'C ', 'old');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `commitee`
--
ALTER TABLE `commitee`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_authentication`
--
ALTER TABLE `user_authentication`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_room`
--
ALTER TABLE `user_room`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `wings`
--
ALTER TABLE `wings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `commitee`
--
ALTER TABLE `commitee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

--
-- AUTO_INCREMENT for table `wings`
--
ALTER TABLE `wings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
