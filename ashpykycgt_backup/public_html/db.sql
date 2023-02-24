-- MariaDB dump 10.19  Distrib 10.4.20-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: ashpykycgt
-- ------------------------------------------------------
-- Server version	10.4.20-MariaDB-1:10.4.20+maria~buster-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Blogs`
--

DROP TABLE IF EXISTS `Blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Blogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Content` longtext DEFAULT NULL,
  `Publisher` varchar(255) DEFAULT NULL,
  `Date` datetime DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Blogs`
--

LOCK TABLES `Blogs` WRITE;
/*!40000 ALTER TABLE `Blogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `Blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bubbles`
--

DROP TABLE IF EXISTS `Bubbles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Bubbles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `BubbleName` varchar(255) DEFAULT NULL,
  `BubbleVideo` varchar(255) DEFAULT NULL,
  `BubbleGif` varchar(255) DEFAULT NULL,
  `BubbleFontSize` int(11) DEFAULT NULL,
  `BubbleTitle` varchar(255) DEFAULT NULL,
  `BubbleSize` int(11) DEFAULT NULL,
  `BubbleBorderColor` varchar(255) DEFAULT NULL,
  `BubbleBackgroundColor` varchar(255) DEFAULT NULL,
  `BubbleButtonColor` varchar(255) DEFAULT NULL,
  `BubbleFontFamily` varchar(255) DEFAULT NULL,
  `BubbleDarken` tinyint(1) DEFAULT NULL,
  `BubbleStyle` varchar(255) DEFAULT NULL,
  `BubblePosition` varchar(255) DEFAULT NULL,
  `BubbleVideoFit` tinyint(1) DEFAULT NULL,
  `BubbleDelay` int(11) DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT NULL,
  `BubbleAnimation` varchar(255) DEFAULT NULL,
  `BubbleCode` varchar(255) DEFAULT NULL,
  `BubbleAvailable` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Bubbles_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bubbles`
--

LOCK TABLES `Bubbles` WRITE;
/*!40000 ALTER TABLE `Bubbles` DISABLE KEYS */;
INSERT INTO `Bubbles` VALUES (1,'Complete Greet','Bubble-Video-file-1671210339942.mp4','Bubble-Video-file-1671210339942.gif',18,'Hey!',82,'#3B5DCD','#ffffff','#CD7D3B','Helvetica',0,'Rectangle','Left',1,2,0,'No-Animation','757f5c5b-1382-5566-8871-e22c2c408d09',1,'2022-12-09 11:57:18','2022-12-16 20:19:27',1),(2,'test','Bubble-Video-file-1670592180174.mp4','Bubble-Video-file-1670592180174.gif',25,'Hey!',300,'#007000','#ffffff','#CD7D3B','Arial',1,'Circle','Right',1,4,0,'Left-to-right','ed44b40c-1324-5ec3-87e6-bd518dcea146',1,'2022-12-09 13:23:00','2022-12-09 14:31:27',2),(3,'Webytoh web services','Bubble-Video-file-1671189499155.mp4','Bubble-Video-file-1671189499155.gif',25,'View My Projects',170,'#002d2b#00968f','#00968f','#002d2b','Lucida',1,'Circle','Left',1,2,0,'No-Animation','3444e6d5-25ff-5e66-84e2-83127dd744ed',1,'2022-12-10 13:34:30','2022-12-16 11:18:19',5);
/*!40000 ALTER TABLE `Bubbles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bugs`
--

DROP TABLE IF EXISTS `Bugs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Bugs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `BugText` varchar(255) DEFAULT NULL,
  `BugCode` varchar(255) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Bugs_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bugs`
--

LOCK TABLES `Bugs` WRITE;
/*!40000 ALTER TABLE `Bugs` DISABLE KEYS */;
INSERT INTO `Bugs` VALUES (1,'test2','Akk5C1b',1,'2022-12-09 13:18:11','2022-12-09 14:30:38',2),(2,'Jooo','NFPASEl',0,'2022-12-12 18:00:47','2022-12-12 18:00:47',2);
/*!40000 ALTER TABLE `Bugs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Chats`
--

DROP TABLE IF EXISTS `Chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Chat_Cookie_id` varchar(255) DEFAULT NULL,
  `ChatCode` varchar(255) DEFAULT NULL,
  `ClientName` text DEFAULT NULL,
  `ClientIPAddress` varchar(255) DEFAULT NULL,
  `ClientCity` varchar(255) DEFAULT NULL,
  `ClientCountry` varchar(255) DEFAULT NULL,
  `ClientEmail` varchar(255) DEFAULT NULL,
  `HosterID` int(11) DEFAULT NULL,
  `BubbleID` int(11) DEFAULT NULL,
  `Chat_Date` datetime DEFAULT NULL,
  `SubscriberID` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Chats`
--

LOCK TABLES `Chats` WRITE;
/*!40000 ALTER TABLE `Chats` DISABLE KEYS */;
INSERT INTO `Chats` VALUES (1,'OWUqOYOLEt','MmcyG','welcome ','197.60.180.121','Giza','Egypt','test@gmail.com',1,1,'2022-12-09 12:58:47',1,'2022-12-09 12:47:24','2022-12-09 12:58:47'),(2,'nAdpm4xWoY','xH7sg','shad','203.76.222.186','Narayanganj','Bangladesh','webcodecare20@gmail.com',1,1,'2022-12-09 18:41:26',4,'2022-12-09 18:34:07','2022-12-09 18:41:26'),(3,'d6jZf2FZSk','FR5sC','test','197.60.180.121','Giza','Egypt','testweb223344@gmail.com',5,3,'2022-12-10 14:24:04',5,'2022-12-10 14:22:52','2022-12-10 14:24:04'),(11,'mB2fNhhWNf','AwpYn','dsa','197.60.59.207','Giza','Egypt','sda@gsol.co',5,3,'2022-12-16 00:39:35',5,'2022-12-16 00:39:17','2022-12-16 00:39:35');
/*!40000 ALTER TABLE `Chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notes`
--

DROP TABLE IF EXISTS `Notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `NoteText` varchar(255) DEFAULT NULL,
  `NoteCode` varchar(255) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Notes_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notes`
--

LOCK TABLES `Notes` WRITE;
/*!40000 ALTER TABLE `Notes` DISABLE KEYS */;
INSERT INTO `Notes` VALUES (1,'test','OrDaMTp',0,'2022-12-09 13:18:05','2022-12-09 13:18:05',2);
/*!40000 ALTER TABLE `Notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Reason` varchar(255) DEFAULT NULL,
  `To` int(11) DEFAULT NULL,
  `Sender` int(11) DEFAULT NULL,
  `Content` longtext DEFAULT NULL,
  `Since` varchar(255) DEFAULT NULL,
  `Time` datetime DEFAULT NULL,
  `Seen` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Notifications_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notifications`
--

LOCK TABLES `Notifications` WRITE;
/*!40000 ALTER TABLE `Notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Plans`
--

DROP TABLE IF EXISTS `Plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `PName` varchar(255) DEFAULT NULL,
  `Duration` int(11) DEFAULT NULL,
  `Order` int(11) DEFAULT NULL,
  `Price` int(11) DEFAULT NULL,
  `Code` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Plans_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Plans`
--

LOCK TABLES `Plans` WRITE;
/*!40000 ALTER TABLE `Plans` DISABLE KEYS */;
INSERT INTO `Plans` VALUES (1,'Free',1,1,0,'CGBasicPType','2022-12-09 11:57:18','2022-12-09 11:57:18',NULL),(2,'Build',1,2,19,'CGBuildPType','2022-12-09 11:57:18','2022-12-10 03:28:25',NULL),(3,'Growth',1,3,25,'CGGrowthPType','2022-12-09 11:57:18','2022-12-09 11:57:18',NULL),(4,'Expand',1,4,49,'CGExpandPType','2022-12-09 11:57:18','2022-12-09 11:57:18',NULL),(5,'Scale',1,5,99,'CGScalePType','2022-12-09 11:57:18','2022-12-09 11:57:18',NULL);
/*!40000 ALTER TABLE `Plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Subscribers`
--

DROP TABLE IF EXISTS `Subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `PName` varchar(255) DEFAULT NULL,
  `PCode` varchar(255) DEFAULT NULL,
  `Subscriber` varchar(255) DEFAULT NULL,
  `SubscriberID` int(11) DEFAULT NULL,
  `Price` varchar(255) DEFAULT NULL,
  `Duration` int(11) DEFAULT 1,
  `CurrentMonth` int(11) DEFAULT 1,
  `EndSubscribeDate` datetime DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `isFinished` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PlanId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `PlanId` (`PlanId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Subscribers_ibfk_319` FOREIGN KEY (`PlanId`) REFERENCES `Plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Subscribers_ibfk_320` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Subscribers`
--

LOCK TABLES `Subscribers` WRITE;
/*!40000 ALTER TABLE `Subscribers` DISABLE KEYS */;
INSERT INTO `Subscribers` VALUES (1,'Free','CGBasicPType','Admin',1,'0',1,1,'2023-01-08 12:29:07',0,1,'2022-12-09 12:29:07','2022-12-09 14:12:03',1,1),(2,'Free','CGBasicPType','test',3,'0',1,1,'2023-01-08 12:54:31',1,0,'2022-12-09 12:54:31','2022-12-09 12:54:31',1,3),(3,'Free','CGBasicPType','shad',2,'0',1,1,'2023-01-08 13:17:55',1,0,'2022-12-09 13:17:55','2022-12-09 13:17:55',1,2),(4,'Growth','CGGrowthPType','Admin',1,'25',1,1,'2023-01-08 14:12:03',1,0,'2022-12-09 14:12:03','2022-12-09 14:12:03',3,1),(5,'Free','CGBasicPType','test',5,'0',1,1,'2023-01-08 21:26:27',1,0,'2022-12-09 21:26:27','2022-12-09 21:26:27',1,5);
/*!40000 ALTER TABLE `Subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SystemInfos`
--

DROP TABLE IF EXISTS `SystemInfos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SystemInfos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `LogoImage` varchar(255) DEFAULT NULL,
  `MetaTitle` varchar(255) DEFAULT NULL,
  `MetaDescription` varchar(255) DEFAULT NULL,
  `NotificationSound` varchar(255) DEFAULT NULL,
  `Code` varchar(255) DEFAULT NULL,
  `BubbleId` int(11) DEFAULT NULL,
  `MaxVideoSize` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemInfos`
--

LOCK TABLES `SystemInfos` WRITE;
/*!40000 ALTER TABLE `SystemInfos` DISABLE KEYS */;
INSERT INTO `SystemInfos` VALUES (1,'Dashboard-logo.png','completegreet','Add Meta Description','https://assets.mixkit.co/sfx/preview/mixkit-happy-bells-notification-937.mp3','CGSystem',1,10000,'2022-12-09 11:57:18','2022-12-14 07:53:23');
/*!40000 ALTER TABLE `SystemInfos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userGroup` int(11) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `CroppedImage` varchar(255) DEFAULT NULL,
  `BusinessName` varchar(255) DEFAULT NULL,
  `Industry` varchar(255) DEFAULT NULL,
  `WebsiteURL` varchar(255) DEFAULT NULL,
  `Goals` varchar(255) DEFAULT NULL,
  `isEnrolled` tinyint(1) DEFAULT NULL,
  `Banned` tinyint(1) DEFAULT NULL,
  `Verified` tinyint(1) DEFAULT NULL,
  `LiveOnBubble` tinyint(1) DEFAULT 1,
  `SendEmail` tinyint(1) DEFAULT 1,
  `PushNotification` tinyint(1) DEFAULT 0,
  `PassReset` varchar(255) DEFAULT NULL,
  `googleId` varchar(255) DEFAULT NULL,
  `VerifyCode` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `GreetMsg` varchar(255) DEFAULT 'Hey, thanks for visiting! Feel free to ask anything.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,1200,'Admin','Admin@completegreet.com','$2a$10$hveuN5xL/siq37otPP2YyeQxIjQFfHgKG98pCcvLhi9Jj0KNa3lni',NULL,NULL,'Complete Greet','SAAS','Completegreet.com ','Goals',0,0,1,1,1,1,NULL,NULL,'none','2022-12-09 11:57:18','2022-12-10 03:03:49','Hey, thanks for visiting! Feel free to ask anything.'),(2,1,'shad','webcodecare20@gmail.com','$2a$10$OOwYDYV2dekKMP1vUJFZKeYRu5fmkgmKdmZH4v5Tv9xNL8ZN2RY7m',NULL,NULL,'webcodecare','it','https://webcodecare.com/','Personal lead generation',0,0,0,1,1,1,NULL,NULL,'IVD7HN1NVNGHI6XSWBMGAUL4PBTQKFB1E47','2022-12-09 12:35:18','2022-12-09 14:30:31','Hey, thanks for visiting! Feel free to ask anything.'),(3,1,'test','test@gmail.com','$2a$10$If6d2RKaZYGnJXhsdjqS1.7G2RRrMra1Kb9kkr30OpYmiPwLKAt.u','Profile-Pic-1670590486521.gif',NULL,'dsa','dsa','dsao.com','Personalize client communication',0,0,0,1,1,0,NULL,NULL,'OFTHWQJF7H3N0FU3JITZF0815QITVE2UBI5','2022-12-09 12:54:04','2022-12-09 12:54:46','Hey, thanks for visiting! Feel free to ask anything.'),(5,1,'test','testweb223344@gmail.com','$2a$10$zAjLCs93.KM4OBzo4I7xgO8VllXvS0.83TVW4SkaSa0amuok1iUDe',NULL,NULL,'sda','dsa','dasd.com','Personalize client communication',0,0,0,1,1,0,'BG4TC',NULL,'R3K2MIG4VOCBN6MTLSB2KGGEVVBHZXMH0Z5','2022-12-09 21:24:50','2022-12-11 20:00:00','Hey, thanks for visiting! Feel free to ask anything.');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Visitors`
--

DROP TABLE IF EXISTS `Visitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Visitors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `IPAddress` varchar(255) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `SubscriberID` int(11) DEFAULT NULL,
  `BubbleID` int(11) DEFAULT NULL,
  `Country` text DEFAULT NULL,
  `City` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Visitors`
--

LOCK TABLES `Visitors` WRITE;
/*!40000 ALTER TABLE `Visitors` DISABLE KEYS */;
INSERT INTO `Visitors` VALUES (1,'197.60.180.121',1,1,1,'Egypt','Giza','2022-12-09 12:46:29','2022-12-09 12:46:29'),(2,'203.76.222.186',1,1,1,'Bangladesh','Narayanganj','2022-12-09 12:56:23','2022-12-09 12:56:23'),(3,'105.207.92.132',1,1,1,'Egypt','Giza','2022-12-09 13:04:35','2022-12-09 13:04:35'),(4,'188.228.125.32',1,4,1,'Denmark','Holstebro','2022-12-10 13:03:53','2022-12-10 13:03:53'),(5,'66.249.93.30',1,4,1,'United States','Ashburn','2022-12-11 03:00:15','2022-12-11 03:00:15'),(6,'66.249.93.28',1,4,1,'United States','Ashburn','2022-12-11 03:00:16','2022-12-11 03:00:16'),(7,'66.249.93.10',5,5,3,'United States','Ashburn','2022-12-11 03:03:55','2022-12-11 03:03:55'),(8,'168.119.65.108',5,5,3,'Germany','Falkenstein','2022-12-11 10:42:39','2022-12-11 10:42:39'),(9,'203.76.222.187',1,4,1,'Bangladesh','Narayanganj','2022-12-11 11:04:04','2022-12-11 11:04:04'),(10,'182.18.206.249',1,4,1,'Philippines','Quezon City','2022-12-11 16:28:05','2022-12-11 16:28:05'),(11,'111.119.183.26',1,4,1,'Pakistan','Karachi','2022-12-11 17:07:38','2022-12-11 17:07:38'),(12,'212.112.148.159',1,4,1,'Denmark','Brønderslev','2022-12-11 21:59:24','2022-12-11 21:59:24'),(13,'37.111.218.215',1,4,1,'Bangladesh','Tongi','2022-12-12 15:20:38','2022-12-12 15:20:38'),(14,'Not found',1,4,1,NULL,NULL,'2022-12-12 18:09:10','2022-12-12 18:09:10'),(15,'156.187.101.21',1,4,1,'Egypt','Cairo','2022-12-12 22:53:02','2022-12-12 22:53:02'),(16,'197.60.155.71',5,5,3,'Egypt','Cairo','2022-12-13 01:34:11','2022-12-13 01:34:11'),(17,'168.119.68.235',5,5,3,'Germany','Falkenstein','2022-12-13 13:26:38','2022-12-13 13:26:38'),(18,'197.60.214.137',5,5,3,'Egypt','Cairo','2022-12-13 21:31:12','2022-12-13 21:31:12'),(19,'66.249.76.60',5,5,3,'United States','Ashburn','2022-12-14 02:29:30','2022-12-14 02:29:30'),(20,'192.175.111.228',1,4,1,'Canada','Hamilton','2022-12-14 08:56:56','2022-12-14 08:56:56'),(21,'72.55.136.156',1,4,1,'Canada','Longueuil','2022-12-14 08:57:03','2022-12-14 08:57:03'),(22,'192.175.111.242',1,4,1,'Canada','Hamilton','2022-12-14 08:57:15','2022-12-14 08:57:15'),(23,'64.15.129.116',1,4,1,'Canada','Montreal','2022-12-14 08:57:19','2022-12-14 08:57:19'),(24,'192.175.111.231',1,4,1,'Canada','Hamilton','2022-12-14 08:57:21','2022-12-14 08:57:21'),(25,'64.15.129.119',1,4,1,'Canada','Montreal','2022-12-14 08:57:28','2022-12-14 08:57:28'),(26,'70.38.27.252',1,4,1,'Canada','Montreal','2022-12-14 08:57:30','2022-12-14 08:57:30'),(27,'64.15.129.117',1,4,1,'Canada','Montreal','2022-12-14 08:57:36','2022-12-14 08:57:36'),(28,'64.15.129.118',1,4,1,'Canada','Montreal','2022-12-14 08:57:48','2022-12-14 08:57:48'),(29,'18.185.36.38',1,4,1,'Germany','Frankfurt am Main','2022-12-14 08:59:49','2022-12-14 08:59:49'),(30,'197.60.59.207',5,5,3,'Egypt','Giza','2022-12-14 20:02:08','2022-12-14 20:02:08'),(31,'66.249.66.156',5,5,3,'United States','Ashburn','2022-12-14 21:32:16','2022-12-14 21:32:16'),(32,'195.154.122.30',5,5,3,'France','Ivry-sur-Seine','2022-12-14 22:49:41','2022-12-14 22:49:41'),(33,'105.88.5.6',1,4,1,'Egypt','Kirdasah','2022-12-14 23:41:05','2022-12-14 23:41:05'),(34,'35.156.182.26',1,4,1,'Germany','Frankfurt am Main','2022-12-15 00:41:24','2022-12-15 00:41:24'),(35,'77.241.136.64',1,4,1,'Denmark','Copenhagen','2022-12-15 10:17:06','2022-12-15 10:17:06'),(36,'77.241.128.119',1,4,1,'Denmark','Copenhagen','2022-12-15 13:27:27','2022-12-15 13:27:27'),(37,'156.187.175.79',5,5,3,'Egypt','Cairo','2022-12-15 18:20:57','2022-12-15 18:20:57'),(38,'168.119.68.126',5,5,3,'Germany','Falkenstein','2022-12-16 12:26:18','2022-12-16 12:26:18'),(39,'35.214.242.237',5,5,3,'Netherlands','Groningen','2022-12-16 20:57:57','2022-12-16 20:57:57'),(40,'203.76.222.184',1,4,1,'Bangladesh','Narayanganj','2022-12-17 05:55:14','2022-12-17 05:55:14');
/*!40000 ALTER TABLE `Visitors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `SenderID` varchar(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `ReceiverID` varchar(255) DEFAULT NULL,
  `BubbleID` varchar(255) DEFAULT NULL,
  `ChatCode` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ChatId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ChatId` (`ChatId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `messages_ibfk_317` FOREIGN KEY (`ChatId`) REFERENCES `Chats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_318` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'MmcyG','2022-12-09 12:47:34','1','1','MmcyG','hello',1,'2022-12-09 12:47:34','2022-12-09 12:47:41',1,1),(2,'1','2022-12-09 12:47:41','test@gmail.com','1','MmcyG','hello',1,'2022-12-09 12:47:41','2022-12-09 12:47:41',1,1),(3,'1','2022-12-09 12:47:46','test@gmail.com','1','MmcyG','how can I help you',1,'2022-12-09 12:47:46','2022-12-09 12:47:46',1,1),(4,'MmcyG','2022-12-09 12:47:53','1','1','MmcyG','cool all is setup',1,'2022-12-09 12:47:53','2022-12-09 12:48:01',1,1),(5,'MmcyG','2022-12-09 12:50:42','1','1','MmcyG','>>',1,'2022-12-09 12:50:42','2022-12-09 12:58:56',1,1),(6,'MmcyG','2022-12-09 12:58:47','1','1','MmcyG','?',1,'2022-12-09 12:58:47','2022-12-09 12:58:56',1,1),(7,'xH7sg','2022-12-09 18:34:09','1','1','xH7sg','hi',1,'2022-12-09 18:34:09','2022-12-09 18:41:21',2,1),(8,'1','2022-12-09 18:41:26','webcodecare20@gmail.com','1','xH7sg','xc',1,'2022-12-09 18:41:26','2022-12-09 18:41:26',2,1),(9,'FR5sC','2022-12-10 14:23:14','5','3','FR5sC','hello',1,'2022-12-10 14:23:14','2022-12-10 14:23:23',3,5),(10,'5','2022-12-10 14:23:26','testweb223344@gmail.com','3','FR5sC','hi',1,'2022-12-10 14:23:26','2022-12-10 14:23:26',3,5),(11,'FR5sC','2022-12-10 14:23:35','5','3','FR5sC','how can I find these products?',1,'2022-12-10 14:23:35','2022-12-10 14:23:50',3,5),(12,'5','2022-12-10 14:23:50','testweb223344@gmail.com','3','FR5sC','check this page!',1,'2022-12-10 14:23:50','2022-12-10 14:23:50',3,5),(13,'FR5sC','2022-12-10 14:24:04','5','3','FR5sC','ok thanks',1,'2022-12-10 14:24:04','2022-12-15 20:52:20',3,5),(120,'AwpYn','2022-12-16 00:39:33','5','3','AwpYn','.fvd',0,'2022-12-16 00:39:33','2022-12-16 00:39:33',11,5),(121,'AwpYn','2022-12-16 00:39:35','5','3','AwpYn','fdg',0,'2022-12-16 00:39:35','2022-12-16 00:39:35',11,5);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planTables`
--

DROP TABLE IF EXISTS `planTables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `planTables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ExerciseID` varchar(255) DEFAULT NULL,
  `Exercise` varchar(255) DEFAULT NULL,
  `Reps` varchar(255) DEFAULT NULL,
  `Sets` varchar(255) DEFAULT NULL,
  `isSuperSet` tinyint(1) DEFAULT NULL,
  `isRest` tinyint(1) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `Day` varchar(255) DEFAULT NULL,
  `Week` varchar(255) DEFAULT NULL,
  `RowID` int(11) DEFAULT NULL,
  `gif` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planTables`
--

LOCK TABLES `planTables` WRITE;
/*!40000 ALTER TABLE `planTables` DISABLE KEYS */;
/*!40000 ALTER TABLE `planTables` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-17 15:07:32
