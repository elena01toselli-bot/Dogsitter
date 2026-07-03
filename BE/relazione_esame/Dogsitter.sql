-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: dogsitter
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.22.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CAMPO_ADDESTRAMENTO`
--

DROP TABLE IF EXISTS `CAMPO_ADDESTRAMENTO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CAMPO_ADDESTRAMENTO` (
  `NOME` varchar(100) NOT NULL,
  `VIA` varchar(100) NOT NULL,
  `N_CIVICO` varchar(10) NOT NULL,
  `CAP` char(5) NOT NULL,
  `PROVINCIA` char(2) NOT NULL,
  `N_TEL` varchar(15) NOT NULL,
  `ORARIO_A` varchar(100) NOT NULL COMMENT 'orario di apertura',
  PRIMARY KEY (`NOME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CAMPO_ADDESTRAMENTO`
--

LOCK TABLES `CAMPO_ADDESTRAMENTO` WRITE;
/*!40000 ALTER TABLE `CAMPO_ADDESTRAMENTO` DISABLE KEYS */;
INSERT INTO `CAMPO_ADDESTRAMENTO` VALUES ('Amici a 4 Zampe','Via Garibaldi','45','10100','PO','0119876543','Mar-Sab 8:00-17:00'),('Campo Verde','Via Roma','12','20100','MI','0212345678','Lun-Ven 9:00-18:00'),('Centro Cinofilo Nord','Via Manzoni','3','20900','MB','0396543210','Mer-Dom 9:00-16:00'),('Dog Academy Milano','via Corso Buenos Aires','7','20124','MI','0287654321','Lun-Dom 7:00-20:00'),('Ferrara Dog Center','Via Po','22','44121','FE','0532123456','Lun-Sab 8:00-18:00'),('La Scuola del Cane','Via Nazionale','88','16100','GE','0101234567','Lun-Sab 10:00-19:00');
/*!40000 ALTER TABLE `CAMPO_ADDESTRAMENTO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CANE`
--

DROP TABLE IF EXISTS `CANE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CANE` (
  `N_MICROCHIP` varchar(20) NOT NULL,
  `NOME` varchar(50) NOT NULL,
  `RAZZA` varchar(50) NOT NULL,
  `TAGLIA` varchar(20) NOT NULL,
  `DATA_NASCITA` date NOT NULL,
  `NOTE_COMPORTAMENTO` text,
  `USERNAME_C` varchar(50) NOT NULL,
  PRIMARY KEY (`N_MICROCHIP`),
  KEY `fk_cane_cliente` (`USERNAME_C`),
  CONSTRAINT `fk_cane_cliente` FOREIGN KEY (`USERNAME_C`) REFERENCES `CLIENTE` (`USERNAME_C`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CANE`
--

LOCK TABLES `CANE` WRITE;
/*!40000 ALTER TABLE `CANE` DISABLE KEYS */;
INSERT INTO `CANE` VALUES ('123456789065432','Nuvola','Maremmano','Grande','2026-01-05','paurosa e ansiosa \n','elena'),('345679876543123','Mia','Labrador','Media','2023-08-23','socievole con i bambini','elena'),('431798654321987','Rex','Meticcio','Piccola','2021-02-17','socievole ma non con i gatti','Fab1o');
/*!40000 ALTER TABLE `CANE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENTE`
--

DROP TABLE IF EXISTS `CLIENTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENTE` (
  `USERNAME_C` varchar(50) NOT NULL,
  PRIMARY KEY (`USERNAME_C`),
  CONSTRAINT `fk_cliente_utente` FOREIGN KEY (`USERNAME_C`) REFERENCES `UTENTE` (`USERNAME`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENTE`
--

LOCK TABLES `CLIENTE` WRITE;
/*!40000 ALTER TABLE `CLIENTE` DISABLE KEYS */;
INSERT INTO `CLIENTE` VALUES ('elena'),('Fab1o');
/*!40000 ALTER TABLE `CLIENTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DOG_SITTER`
--

DROP TABLE IF EXISTS `DOG_SITTER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DOG_SITTER` (
  `USERNAME_D` varchar(50) NOT NULL,
  `MAX_CANI` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`USERNAME_D`),
  CONSTRAINT `fk_dogsitter_utente` FOREIGN KEY (`USERNAME_D`) REFERENCES `UTENTE` (`USERNAME`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DOG_SITTER`
--

LOCK TABLES `DOG_SITTER` WRITE;
/*!40000 ALTER TABLE `DOG_SITTER` DISABLE KEYS */;
INSERT INTO `DOG_SITTER` VALUES ('Albi',6),('anna.ferrari',3),('sofia.esposito',2);
/*!40000 ALTER TABLE `DOG_SITTER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ESECUZIONE_SERVIZIO`
--

DROP TABLE IF EXISTS `ESECUZIONE_SERVIZIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ESECUZIONE_SERVIZIO` (
  `CODICE_ID_PREN` int NOT NULL,
  `ID_SERVIZIO` int NOT NULL,
  `USERNAME_D` varchar(50) NOT NULL,
  `ORA_SVOLGIMENTO` time NOT NULL,
  `DATA_SVOLGIMENTO` date NOT NULL,
  PRIMARY KEY (`CODICE_ID_PREN`,`ID_SERVIZIO`,`USERNAME_D`),
  KEY `fk_esec_servizio` (`ID_SERVIZIO`),
  KEY `fk_esec_dogsitter` (`USERNAME_D`),
  CONSTRAINT `fk_esec_dogsitter` FOREIGN KEY (`USERNAME_D`) REFERENCES `DOG_SITTER` (`USERNAME_D`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_esec_prenotazione` FOREIGN KEY (`CODICE_ID_PREN`) REFERENCES `PRENOTAZIONE` (`CODICE_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_esec_servizio` FOREIGN KEY (`ID_SERVIZIO`) REFERENCES `SERVIZIO` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ESECUZIONE_SERVIZIO`
--

LOCK TABLES `ESECUZIONE_SERVIZIO` WRITE;
/*!40000 ALTER TABLE `ESECUZIONE_SERVIZIO` DISABLE KEYS */;
INSERT INTO `ESECUZIONE_SERVIZIO` VALUES (19,1,'anna.ferrari','10:00:00','2026-07-05'),(23,9,'Albi','15:00:00','2026-07-25'),(24,6,'Albi','18:00:00','2026-07-01'),(26,6,'Albi','17:00:00','2026-07-01'),(27,13,'sofia.esposito','18:00:00','2026-07-08'),(29,7,'Albi','09:00:00','2026-07-05');
/*!40000 ALTER TABLE `ESECUZIONE_SERVIZIO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GIORNI_DOG_SITTER`
--

DROP TABLE IF EXISTS `GIORNI_DOG_SITTER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GIORNI_DOG_SITTER` (
  `USERNAME_D` varchar(50) NOT NULL,
  `GIORNO_DISPONIBILE` varchar(20) NOT NULL COMMENT 'es: Lunedì, Martedì...',
  PRIMARY KEY (`USERNAME_D`,`GIORNO_DISPONIBILE`),
  CONSTRAINT `fk_giorni_dogsitter` FOREIGN KEY (`USERNAME_D`) REFERENCES `DOG_SITTER` (`USERNAME_D`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GIORNI_DOG_SITTER`
--

LOCK TABLES `GIORNI_DOG_SITTER` WRITE;
/*!40000 ALTER TABLE `GIORNI_DOG_SITTER` DISABLE KEYS */;
INSERT INTO `GIORNI_DOG_SITTER` VALUES ('Albi','GIO'),('Albi','LUN'),('Albi','MAR'),('Albi','MER'),('Albi','VEN'),('anna.ferrari','LUN'),('anna.ferrari','MAR'),('anna.ferrari','MER'),('anna.ferrari','VEN'),('sofia.esposito','DOM'),('sofia.esposito','GIO'),('sofia.esposito','LUN'),('sofia.esposito','SAB');
/*!40000 ALTER TABLE `GIORNI_DOG_SITTER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LEZIONE`
--

DROP TABLE IF EXISTS `LEZIONE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LEZIONE` (
  `NOME_CAMPO` varchar(100) NOT NULL,
  `ORA` time NOT NULL,
  `DATA` date NOT NULL,
  `TIPOLOGIA` varchar(50) NOT NULL,
  `MAX_PARTECIPANTI` int NOT NULL DEFAULT '10',
  PRIMARY KEY (`NOME_CAMPO`,`ORA`,`DATA`),
  KEY `fk_lezione_tipologia` (`TIPOLOGIA`),
  CONSTRAINT `fk_lezione_campo` FOREIGN KEY (`NOME_CAMPO`) REFERENCES `CAMPO_ADDESTRAMENTO` (`NOME`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_lezione_tipologia` FOREIGN KEY (`TIPOLOGIA`) REFERENCES `TIPOLOGIE_LEZIONI` (`TIPOLOGIA`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LEZIONE`
--

LOCK TABLES `LEZIONE` WRITE;
/*!40000 ALTER TABLE `LEZIONE` DISABLE KEYS */;
INSERT INTO `LEZIONE` VALUES ('Amici a 4 Zampe','10:00:00','2026-07-02','Obbedienza base',10),('Amici a 4 Zampe','15:45:00','2026-07-15','Socializzazione',10),('Campo Verde','09:00:00','2026-07-01','Obbedienza base',8),('Campo Verde','11:00:00','2026-07-01','Agility',6),('Centro Cinofilo Nord','09:30:00','2026-07-04','Cuccioli',8),('Dog Academy Milano','14:00:00','2026-07-03','Obbedienza avanzata',5),('Dog Academy Milano','16:00:00','2026-07-03','Agility',6),('Ferrara Dog Center','10:00:00','2026-07-06','Obbedienza base',8),('Ferrara Dog Center','16:00:00','2026-07-10','Agility',6),('La Scuola del Cane','11:00:00','2026-07-05','Obbedienza base',10),('La Scuola del Cane','15:00:00','2026-07-05','Difesa personale',4);
/*!40000 ALTER TABLE `LEZIONE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OFFRE`
--

DROP TABLE IF EXISTS `OFFRE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OFFRE` (
  `USERNAME_D` varchar(50) NOT NULL,
  `ID_SERVIZIO` int NOT NULL,
  `PREZZO_LISTINO` decimal(8,2) NOT NULL,
  PRIMARY KEY (`USERNAME_D`,`ID_SERVIZIO`),
  KEY `fk_offre_servizio` (`ID_SERVIZIO`),
  CONSTRAINT `fk_offre_dogsitter` FOREIGN KEY (`USERNAME_D`) REFERENCES `DOG_SITTER` (`USERNAME_D`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_offre_servizio` FOREIGN KEY (`ID_SERVIZIO`) REFERENCES `SERVIZIO` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OFFRE`
--

LOCK TABLES `OFFRE` WRITE;
/*!40000 ALTER TABLE `OFFRE` DISABLE KEYS */;
INSERT INTO `OFFRE` VALUES ('Albi',6,40.00),('Albi',7,25.00),('Albi',8,30.00),('Albi',9,37.00),('anna.ferrari',1,10.00),('anna.ferrari',14,30.00),('sofia.esposito',12,20.00),('sofia.esposito',13,15.00);
/*!40000 ALTER TABLE `OFFRE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PRENOTAZIONE`
--

DROP TABLE IF EXISTS `PRENOTAZIONE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PRENOTAZIONE` (
  `CODICE_ID` int NOT NULL AUTO_INCREMENT,
  `PREZZO_PATTUITO` decimal(8,2) NOT NULL,
  `TIPOLOGIA_ATTIVITA` varchar(50) NOT NULL COMMENT 'Servizio o Lezione',
  `N_MICROCHIP` varchar(20) NOT NULL,
  `NOME_CAMPO` varchar(100) DEFAULT NULL,
  `ORA_LEZIONE` time DEFAULT NULL,
  `DATA_LEZIONE` date DEFAULT NULL,
  PRIMARY KEY (`CODICE_ID`),
  KEY `fk_pren_cane` (`N_MICROCHIP`),
  KEY `fk_pren_lezione` (`NOME_CAMPO`,`ORA_LEZIONE`,`DATA_LEZIONE`),
  CONSTRAINT `fk_pren_cane` FOREIGN KEY (`N_MICROCHIP`) REFERENCES `CANE` (`N_MICROCHIP`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pren_lezione` FOREIGN KEY (`NOME_CAMPO`, `ORA_LEZIONE`, `DATA_LEZIONE`) REFERENCES `LEZIONE` (`NOME_CAMPO`, `ORA`, `DATA`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PRENOTAZIONE`
--

LOCK TABLES `PRENOTAZIONE` WRITE;
/*!40000 ALTER TABLE `PRENOTAZIONE` DISABLE KEYS */;
INSERT INTO `PRENOTAZIONE` VALUES (4,35.00,'lezione','345679876543123','Dog Academy Milano','14:00:00','2026-07-03'),(19,10.00,'dogsitter','123456789065432',NULL,NULL,NULL),(21,25.00,'lezione','123456789065432','Campo Verde','09:00:00','2026-07-01'),(23,37.00,'dogsitter','345679876543123',NULL,NULL,NULL),(24,40.00,'dogsitter','123456789065432',NULL,NULL,NULL),(26,40.00,'dogsitter','345679876543123',NULL,NULL,NULL),(27,15.00,'dogsitter','431798654321987',NULL,NULL,NULL),(28,35.00,'lezione','431798654321987','Dog Academy Milano','14:00:00','2026-07-03'),(29,25.00,'dogsitter','431798654321987',NULL,NULL,NULL),(30,25.00,'lezione','345679876543123','Ferrara Dog Center','10:00:00','2026-07-06');
/*!40000 ALTER TABLE `PRENOTAZIONE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RECENSISCE`
--

DROP TABLE IF EXISTS `RECENSISCE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RECENSISCE` (
  `USERNAME_C` varchar(50) NOT NULL,
  `USERNAME_D` varchar(50) NOT NULL,
  `VOTO` int NOT NULL,
  `COMMENTO` text,
  `DATA` date NOT NULL,
  PRIMARY KEY (`USERNAME_C`,`USERNAME_D`),
  KEY `fk_rec_dogsitter` (`USERNAME_D`),
  CONSTRAINT `fk_rec_cliente` FOREIGN KEY (`USERNAME_C`) REFERENCES `CLIENTE` (`USERNAME_C`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rec_dogsitter` FOREIGN KEY (`USERNAME_D`) REFERENCES `DOG_SITTER` (`USERNAME_D`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RECENSISCE_chk_1` CHECK ((`VOTO` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RECENSISCE`
--

LOCK TABLES `RECENSISCE` WRITE;
/*!40000 ALTER TABLE `RECENSISCE` DISABLE KEYS */;
INSERT INTO `RECENSISCE` VALUES ('elena','Albi',4,'Gestire un cane ansioso e timoroso non è facile, ma Albi ci è riuscito benissimo grazie al suo carattere calmo e dolce. Il mio cane è tornato a casa rilassato e non stressato, segno che si è sentito al sicuro con lui. Do 4 stelle solo perché c\'è stata un po\' di confusione sull\'orario del ritiro, ma per il resto lo richiamerò sicuramente.\n\n\n','2026-06-25'),('elena','anna.ferrari',3,'Anna è una ragazza dolce e si vede che ci tiene, ma con il mio cane, che è molto timoroso e ansioso, non è scattata la scintilla. È stata un po\' troppo frettolosa nel cercare l\'approccio, finendo per spaventarlo più del dovuto invece di dargli i suoi tempi.\n\nIl cane è comunque tornato a casa sano e salvo, ma l\'ho trovato piuttosto stressato. Sicuramente Anna è bravissima con cani più socievoli, ma le manca ancora un po\' di esperienza e pazienza con quelli più fragili.','2026-06-25'),('Fab1o','Albi',5,'Albi è un ragazzo fantastico, solare e super affidabile. Il mio cane, che è molto socievole, si è affezionato a lui fin dal primo secondo. Albi è stato super disponibile e lo ha persino accompagnato all\'appuntamento per la toelettatura, gestendo tutto alla perfezione e mandandomi foto bellissime. Un servizio impeccabile dall\'inizio alla fine, lo richiamerò sicuramente!','2026-06-25'),('Fab1o','sofia.esposito',2,'Sofia è una ragazza educata, ma le manca il polso per gestire situazioni tese. Sapeva benissimo che il mio cane odia i gatti, eppure durante la passeggiata non ha saputo anticipare la sua reazione quando ne ha incrociato uno. Il cane ha iniziato a tirare come un matto e lei è andata completamente nel panico invece di calmarlo o cambiare strada. Servizio poco sicuro.','2026-06-25');
/*!40000 ALTER TABLE `RECENSISCE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SERVIZIO`
--

DROP TABLE IF EXISTS `SERVIZIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SERVIZIO` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `DURATA` int NOT NULL COMMENT 'durata in minuti',
  `CATEGORIA` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SERVIZIO`
--

LOCK TABLES `SERVIZIO` WRITE;
/*!40000 ALTER TABLE `SERVIZIO` DISABLE KEYS */;
INSERT INTO `SERVIZIO` VALUES (1,60,'Passeggiata'),(2,120,'Custodia giornaliera'),(3,30,'Visita in casa'),(4,480,'Pensione'),(5,45,'Toelettatura'),(6,60,'Custodia giornaliera'),(7,50,'Toelettatura'),(8,60,'Pensione'),(9,120,'Custodia giornaliera'),(10,30,'Passeggiata'),(11,60,'Custodia giornaliera'),(12,120,'Visita in casa'),(13,45,'Passeggiata'),(14,120,'Pensione');
/*!40000 ALTER TABLE `SERVIZIO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TAGLIE_CANI`
--

DROP TABLE IF EXISTS `TAGLIE_CANI`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TAGLIE_CANI` (
  `USERNAME_D` varchar(50) NOT NULL,
  `TAGLIA` varchar(20) NOT NULL COMMENT 'Piccola, Media, Grande',
  PRIMARY KEY (`USERNAME_D`,`TAGLIA`),
  CONSTRAINT `fk_taglie_dogsitter` FOREIGN KEY (`USERNAME_D`) REFERENCES `DOG_SITTER` (`USERNAME_D`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TAGLIE_CANI`
--

LOCK TABLES `TAGLIE_CANI` WRITE;
/*!40000 ALTER TABLE `TAGLIE_CANI` DISABLE KEYS */;
INSERT INTO `TAGLIE_CANI` VALUES ('Albi','MEDIA'),('Albi','PICCOLA'),('anna.ferrari','GRANDE'),('anna.ferrari','MEDIA'),('anna.ferrari','PICCOLA'),('sofia.esposito','MEDIA'),('sofia.esposito','PICCOLA');
/*!40000 ALTER TABLE `TAGLIE_CANI` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TIPOLOGIE_LEZIONI`
--

DROP TABLE IF EXISTS `TIPOLOGIE_LEZIONI`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TIPOLOGIE_LEZIONI` (
  `TIPOLOGIA` varchar(50) NOT NULL,
  `COSTO` decimal(8,2) NOT NULL,
  PRIMARY KEY (`TIPOLOGIA`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TIPOLOGIE_LEZIONI`
--

LOCK TABLES `TIPOLOGIE_LEZIONI` WRITE;
/*!40000 ALTER TABLE `TIPOLOGIE_LEZIONI` DISABLE KEYS */;
INSERT INTO `TIPOLOGIE_LEZIONI` VALUES ('Agility',30.00),('Cuccioli',20.00),('Difesa personale',40.00),('Obbedienza avanzata',35.00),('Obbedienza base',25.00),('Socializzazione',20.00);
/*!40000 ALTER TABLE `TIPOLOGIE_LEZIONI` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UTENTE`
--

DROP TABLE IF EXISTS `UTENTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UTENTE` (
  `USERNAME` varchar(50) NOT NULL,
  `NOME_BATT` varchar(50) NOT NULL,
  `COGNOME` varchar(50) NOT NULL,
  `CAP` char(5) NOT NULL,
  `N_CIVICO` varchar(10) NOT NULL,
  `PROVINCIA` char(2) NOT NULL,
  `VIA` varchar(100) NOT NULL,
  `N_TEL` varchar(15) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  PRIMARY KEY (`USERNAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UTENTE`
--

LOCK TABLES `UTENTE` WRITE;
/*!40000 ALTER TABLE `UTENTE` DISABLE KEYS */;
INSERT INTO `UTENTE` VALUES ('admin','alberto','bagnolin','47039','8','FC','Via don','3519019463','$2a$10$p4NnC9OM.zYdwwGlhmjvrOi45zD9NxPpipLnzRp/qk4JFXK.Zzn8i'),('Albi','Alberto','Bagnolini','33975','34','BS','via Giulio','7654345678','$2a$10$0oWDJX7n5kYCQVks56J1xe7a8CW9zyk/BVV5Sy0gyjAd4DMhfrogO'),('anna.ferrari','Anna','Ferrari','16100','7','GE','Via Nazionale','3401112233','$2a$10$Hm3Lp7Xz9RfTb3Wz5fGz3.2P6YcXk5j2eYJZcXk2N4eYJZcXk5j2e'),('elena','Elena','Toselli','44028','25','FE','via Giuseppe di Vittorio','0987654334','$2a$10$rWyvKQlz5b5ljZVJJ0asFeWft08Ziha77AGXPJNeiDACMZYp30H32'),('Fab1o','Fabio','Rossi','29764','34','MI','Via Garibaldi','3365432789','$2a$10$PXxbmbS6H5ZpBgKzU7ZtjO9OFEfH5vubA5r66INDYoypcubcTKrBO'),('sofia.esposito','Sofia','Esposito','20124','22','MI','Via Pio','3289988776','$2a$10$Zq5Rn4Xz3RfTb3Wz5fGz3.9L2YcXk5j2eYJZcXk2N4eYJZcXk5j2e');
/*!40000 ALTER TABLE `UTENTE` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-03 18:11:11
