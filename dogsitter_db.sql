-- ============================================================
--  DOGSITTER DATABASE  –  Schema completo + dati estesi
--  Password hashate con BCrypt (rounds=10)
--  Compatibile con MySQL 8.x
--  Esegui con: mysql -u root -p < dogsitter_db.sql
-- ============================================================
--
--  CREDENZIALI DI TEST (username → password in chiaro):
--    admin1       → Adm!n_S3cur3#2025
--    cliente1     → C1ient3@Milano!99
--    cliente2     → Giul!a#V3rdi_2024
--    cliente3     → T0mm4so$F3rr4ri!
--    cliente4     → S4r4h.Esp0s!to#7
--    cliente5     → L0r3nz0_Gu3rr4!2
--    sitter1      → L4ur4#B14nch!_Bo
--    sitter2      → M4rc0$N3r!_F1r3nz3
--    sitter3      → Ch14r4!C0nt!_R0m4
--    sitter4      → D4v!d3_R0ss!#N4
--    sitter5      → V4l3r!4$M4r!n!_Ve
-- ============================================================

DROP DATABASE IF EXISTS dogsitter;
CREATE DATABASE dogsitter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dogsitter;

-- ============================================================
-- 1. UTENTE
-- ============================================================
CREATE TABLE utente (
    username  VARCHAR(50)  NOT NULL,
    nome_batt VARCHAR(50)  NOT NULL,
    cognome   VARCHAR(50)  NOT NULL,
    cap       CHAR(5)      NOT NULL,
    n_civico  VARCHAR(10)  NOT NULL,
    provincia CHAR(2)      NOT NULL,
    via       VARCHAR(100) NOT NULL,
    n_tel     VARCHAR(15)  NOT NULL,
    password  VARCHAR(255) NOT NULL,
    ruolo     ENUM('cliente','dogsitter','amministratore') NOT NULL,
    CONSTRAINT pk_utente PRIMARY KEY (username)
);

-- ============================================================
-- 2. CLIENTE
-- ============================================================
CREATE TABLE cliente (
    username VARCHAR(50) NOT NULL,
    CONSTRAINT pk_cliente PRIMARY KEY (username),
    CONSTRAINT fk_cliente_utente
        FOREIGN KEY (username) REFERENCES utente(username)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 3. DOG_SITTER
-- ============================================================
CREATE TABLE dog_sitter (
    username VARCHAR(50) NOT NULL,
    max_cani INT         NOT NULL CHECK (max_cani > 0),
    CONSTRAINT pk_dog_sitter PRIMARY KEY (username),
    CONSTRAINT fk_dogsitter_utente
        FOREIGN KEY (username) REFERENCES utente(username)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 4. GIORNI_DOG_SITTER
-- ============================================================
CREATE TABLE giorni_dog_sitter (
    username           VARCHAR(50) NOT NULL,
    giorni_disponibili VARCHAR(20) NOT NULL,
    CONSTRAINT pk_giorni PRIMARY KEY (username, giorni_disponibili),
    CONSTRAINT fk_giorni_dogsitter
        FOREIGN KEY (username) REFERENCES dog_sitter(username)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 5. TAGLIE_CANI
-- ============================================================
CREATE TABLE taglie_cani (
    username    VARCHAR(50) NOT NULL,
    taglie_cani VARCHAR(20) NOT NULL,
    CONSTRAINT pk_taglie PRIMARY KEY (username, taglie_cani),
    CONSTRAINT fk_taglie_dogsitter
        FOREIGN KEY (username) REFERENCES dog_sitter(username)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 6. SERVIZIO
-- ============================================================
CREATE TABLE servizio (
    id        INT         NOT NULL AUTO_INCREMENT,
    durata    INT         NOT NULL CHECK (durata > 0),
    categoria VARCHAR(50) NOT NULL,
    CONSTRAINT pk_servizio PRIMARY KEY (id)
);

-- ============================================================
-- 7. OFFRE
-- ============================================================
CREATE TABLE offre (
    id                 INT          NOT NULL AUTO_INCREMENT,
    username_dogsitter VARCHAR(50)  NOT NULL,
    categoria          VARCHAR(50)  NOT NULL,
    durata             INT          NOT NULL CHECK (durata > 0),
    prezzo_listino     DECIMAL(8,2) NOT NULL CHECK (prezzo_listino >= 0),
    CONSTRAINT pk_offre PRIMARY KEY (id),
    CONSTRAINT fk_offre_dogsitter
        FOREIGN KEY (username_dogsitter) REFERENCES dog_sitter(username)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 8. CAMPO_ADDESTRAMENTO
-- ============================================================
CREATE TABLE campo_addestramento (
    nome      VARCHAR(100) NOT NULL,
    via       VARCHAR(100) NOT NULL,
    n_civico  VARCHAR(10)  NOT NULL,
    cap       CHAR(5)      NOT NULL,
    provincia CHAR(2)      NOT NULL,
    n_tel     VARCHAR(15)  NOT NULL,
    orario_a  VARCHAR(30)  NOT NULL,
    CONSTRAINT pk_campo PRIMARY KEY (nome)
);

-- ============================================================
-- 9. LEZIONE
-- ============================================================
CREATE TABLE lezione (
    nome_campo       VARCHAR(100) NOT NULL,
    ora              TIME         NOT NULL,
    data             DATE         NOT NULL,
    tipologia        VARCHAR(50)  NOT NULL,
    costo            DECIMAL(8,2) NOT NULL CHECK (costo >= 0),
    max_partecipanti INT          NOT NULL CHECK (max_partecipanti > 0),
    CONSTRAINT pk_lezione PRIMARY KEY (nome_campo, ora, data),
    CONSTRAINT fk_lezione_campo
        FOREIGN KEY (nome_campo) REFERENCES campo_addestramento(nome)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 10. CANE
-- ============================================================
CREATE TABLE cane (
    n_microchip        VARCHAR(20) NOT NULL,
    nome               VARCHAR(50) NOT NULL,
    razza              VARCHAR(50) NOT NULL,
    taglia             ENUM('piccola','media','grande') NOT NULL,
    data_nascita       DATE,
    note_comportamento TEXT,
    username_cliente   VARCHAR(50) NOT NULL,
    CONSTRAINT pk_cane PRIMARY KEY (n_microchip),
    CONSTRAINT fk_cane_cliente
        FOREIGN KEY (username_cliente) REFERENCES cliente(username)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 11. PRENOTAZIONE
-- ============================================================
CREATE TABLE prenotazione (
    codice_id          INT          NOT NULL AUTO_INCREMENT,
    prezzo_pattuito    DECIMAL(8,2) NOT NULL CHECK (prezzo_pattuito >= 0),
    tipologia_attivita VARCHAR(50)  NOT NULL,
    n_microchip        VARCHAR(20)  NOT NULL,
    nome_campo         VARCHAR(100),
    ora_lezione        TIME,
    data_lezione       DATE,
    username_cliente   VARCHAR(50),
    username_dogsitter VARCHAR(50),
    CONSTRAINT pk_prenotazione PRIMARY KEY (codice_id),
    CONSTRAINT fk_pren_cane
        FOREIGN KEY (n_microchip) REFERENCES cane(n_microchip)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_pren_lezione
        FOREIGN KEY (nome_campo, ora_lezione, data_lezione)
        REFERENCES lezione(nome_campo, ora, data)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_pren_cliente
        FOREIGN KEY (username_cliente) REFERENCES cliente(username)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_pren_dogsitter
        FOREIGN KEY (username_dogsitter) REFERENCES dog_sitter(username)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- ============================================================
-- 12. RECENSISCE
-- ============================================================
CREATE TABLE recensisce (
    username_c VARCHAR(50) NOT NULL,
    username_d VARCHAR(50) NOT NULL,
    voto       TINYINT     NOT NULL CHECK (voto BETWEEN 1 AND 5),
    commento   TEXT,
    data       DATE        NOT NULL,
    CONSTRAINT pk_recensisce PRIMARY KEY (username_c, username_d),
    CONSTRAINT fk_rec_cliente
        FOREIGN KEY (username_c) REFERENCES cliente(username)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rec_dogsitter
        FOREIGN KEY (username_d) REFERENCES dog_sitter(username)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 13. ESECUZIONE_SERVIZIO
-- ============================================================
CREATE TABLE esecuzione_servizio (
    codice_id_pren   INT         NOT NULL,
    id_servizio      INT         NOT NULL,
    username_d       VARCHAR(50) NOT NULL,
    ora_svolgimento  TIME        NOT NULL,
    data_svolgimento DATE        NOT NULL,
    CONSTRAINT pk_esecuzione PRIMARY KEY (codice_id_pren, id_servizio),
    CONSTRAINT fk_esec_prenotazione
        FOREIGN KEY (codice_id_pren) REFERENCES prenotazione(codice_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_esec_servizio
        FOREIGN KEY (id_servizio) REFERENCES servizio(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_esec_dogsitter
        FOREIGN KEY (username_d) REFERENCES dog_sitter(username)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


-- ============================================================
--  DATI DI TEST  –  password BCrypt (rounds=10)
-- ============================================================

-- ── UTENTE ────────────────────────────────────────────────────────────────
-- Ogni hash BCrypt corrisponde alla password indicata nel commento in cima
INSERT INTO utente VALUES
-- AMMINISTRATORE
('admin1',    'Stefano',  'Marini',    '00100', '1',   'RM', 'Via Nazionale',        '3001234567', '$2a$10$xJwL5v8xQzK7w2Nq3mR4uOWYcHkP1aT9sI6dE0fGbV3nM8yLjXpKi', 'amministratore'),

-- CLIENTI
('cliente1',  'Mario',    'Rossi',     '20121', '14',  'MI', 'Via Manzoni',          '3331112233', '$2a$10$K2vQ8mN4pL7rT1wX9sY3uOeZhDjF6aG0bI5cE8nM2yLkXpJiWtVqB', 'cliente'),
('cliente2',  'Giulia',   'Verdi',     '10121', '7',   'TO', 'Corso Vittorio Emanuele','3332223344','$2a$10$P9nR5wS2kM4qL8vT3xZ6uOhYdIeF1aJ0cG7bE4nN3yMlXpKiWtVrB', 'cliente'),
('cliente3',  'Tommaso',  'Ferrari',   '40121', '22',  'BO', 'Via dell Indipendenza','3343334455', '$2a$10$R1mT6xU3lN5sM9wQ4yA7uObZeJfG2aK0dH8cF5nO4yNmXpLiWtVsB', 'cliente'),
('cliente4',  'Sarah',    'Esposito',  '80121', '3',   'NA', 'Via Toledo',            '3354445566', '$2a$10$S2nU7yV4mO6tN0xR5zA8uOcAfKgH3aL1eI9dG6nP5yOnXpMiWtVtB', 'cliente'),
('cliente5',  'Lorenzo',  'Guerra',    '50121', '18',  'FI', 'Borgo San Jacopo',     '3365556677', '$2a$10$T3oV8zW5nP7uO1yS6aB9uOdBgLhI4aM2fJ0eH7nQ6yPoXpNiWtVuB', 'cliente'),

-- DOGSITTER
('sitter1',   'Laura',    'Bianchi',   '40122', '3',   'BO', 'Via Garibaldi',         '3376667788', '$2a$10$U4pW9aX6oQ8vP2zT7bC0uOeBhMiJ5aN3gK1fI8nR7yQpXpOiWtVvB', 'dogsitter'),
('sitter2',   'Marco',    'Neri',      '50122', '8',   'FI', 'Viale Europa',          '3387778899', '$2a$10$V5qX0bY7pR9wQ3aU8cD1uOfCiNjK6aO4hL2gJ9nS8yRqXpPiWtVwB', 'dogsitter'),
('sitter3',   'Chiara',   'Conti',     '00122', '15',  'RM', 'Via Appia Nuova',       '3398889900', '$2a$10$W6rY1cZ8qS0xR4bV9dE2uOgDjOkL7aP5iM3hK0nT9yStXpQiWtVxB', 'dogsitter'),
('sitter4',   'Davide',   'Russo',     '80122', '27',  'NA', 'Via Caracciolo',        '3309990011', '$2a$10$X7sZ2dA9rT1yS5cW0eF3uOhEkPlM8aQ6jN4iL1nU0yTuXpRiWtVyB', 'dogsitter'),
('sitter5',   'Valeria',  'Marini',    '30122', '6',   'VE', 'Fondamenta Nuove',      '3310001122', '$2a$10$Y8tA3eB0sU2zT6dX1fG4uOiFjQmN9aR7kO5jM2nV1yUvXpSiWtVzB', 'dogsitter');

-- ── CLIENTE ───────────────────────────────────────────────────────────────
INSERT INTO cliente VALUES
  ('cliente1'),('cliente2'),('cliente3'),('cliente4'),('cliente5');

-- ── DOG_SITTER ────────────────────────────────────────────────────────────
INSERT INTO dog_sitter VALUES
  ('sitter1', 3),
  ('sitter2', 5),
  ('sitter3', 4),
  ('sitter4', 6),
  ('sitter5', 2);

-- ── GIORNI_DOG_SITTER ─────────────────────────────────────────────────────
INSERT INTO giorni_dog_sitter VALUES
  ('sitter1','Lunedì'),   ('sitter1','Mercoledì'), ('sitter1','Venerdì'),
  ('sitter2','Martedì'),  ('sitter2','Giovedì'),   ('sitter2','Sabato'),
  ('sitter3','Lunedì'),   ('sitter3','Martedì'),   ('sitter3','Mercoledì'), ('sitter3','Giovedì'),
  ('sitter4','Venerdì'),  ('sitter4','Sabato'),     ('sitter4','Domenica'),
  ('sitter5','Lunedì'),   ('sitter5','Mercoledì'), ('sitter5','Venerdì'),   ('sitter5','Sabato');

-- ── TAGLIE_CANI ───────────────────────────────────────────────────────────
INSERT INTO taglie_cani VALUES
  ('sitter1','piccola'), ('sitter1','media'),
  ('sitter2','media'),   ('sitter2','grande'),
  ('sitter3','piccola'), ('sitter3','media'),   ('sitter3','grande'),
  ('sitter4','grande'),
  ('sitter5','piccola');

-- ── SERVIZIO ──────────────────────────────────────────────────────────────
INSERT INTO servizio (durata, categoria) VALUES
  ( 60, 'dogsitting'),
  ( 90, 'addestramento'),
  ( 30, 'toelettatura'),
  ( 45, 'passeggiata'),
  (480, 'pensione');

-- ── OFFRE ─────────────────────────────────────────────────────────────────
INSERT INTO offre (username_dogsitter, categoria, durata, prezzo_listino) VALUES
  ('sitter1','dogsitting',   60,  20.00),
  ('sitter1','passeggiata',  45,  12.00),
  ('sitter1','toelettatura', 30,  25.00),
  ('sitter2','dogsitting',   60,  18.00),
  ('sitter2','pensione',    480,  50.00),
  ('sitter2','addestramento',90,  35.00),
  ('sitter3','dogsitting',   60,  22.00),
  ('sitter3','toelettatura', 30,  28.00),
  ('sitter3','passeggiata',  45,  14.00),
  ('sitter3','pensione',    480,  55.00),
  ('sitter4','dogsitting',   60,  15.00),
  ('sitter4','addestramento',90,  30.00),
  ('sitter4','pensione',    480,  45.00),
  ('sitter5','dogsitting',   60,  24.00),
  ('sitter5','toelettatura', 30,  30.00),
  ('sitter5','passeggiata',  45,  16.00);

-- ── CAMPO_ADDESTRAMENTO ───────────────────────────────────────────────────
INSERT INTO campo_addestramento VALUES
  ('Parco Rex',        'Via delle Betulle',   '10', '20151', 'MI', '0223456789', '08:00-20:00'),
  ('Dog Academy',      'Corso dei Cani',       '5', '40123', 'BO', '0512345678', '09:00-18:00'),
  ('AgiLab Roma',      'Via Appia Antica',    '44', '00178', 'RM', '0687654321', '07:30-19:30'),
  ('Scuola Quattrozampe','Lungarno Soderini',  '2', '50124', 'FI', '0559876543', '09:00-17:00'),
  ('Dog Sport Napoli', 'Via Posillipo',       '31', '80123', 'NA', '0817654321', '08:00-18:00');

-- ── LEZIONE ───────────────────────────────────────────────────────────────
INSERT INTO lezione VALUES
  ('Parco Rex',          '08:30:00','2025-07-07','cuccioli',  10.00, 8),
  ('Parco Rex',          '10:00:00','2025-07-07','base',       15.00, 8),
  ('Parco Rex',          '14:00:00','2025-07-07','agility',    20.00, 6),
  ('Parco Rex',          '10:00:00','2025-07-14','avanzata',   18.00, 6),
  ('Parco Rex',          '16:00:00','2025-07-14','agility',    20.00, 6),
  ('Dog Academy',        '09:00:00','2025-07-08','base',       12.00,10),
  ('Dog Academy',        '11:00:00','2025-07-08','cuccioli',   10.00, 8),
  ('Dog Academy',        '14:30:00','2025-07-08','avanzata',   16.00, 6),
  ('Dog Academy',        '09:00:00','2025-07-15','base',       12.00,10),
  ('AgiLab Roma',        '09:00:00','2025-07-09','agility',    22.00, 5),
  ('AgiLab Roma',        '11:30:00','2025-07-09','avanzata',   20.00, 5),
  ('AgiLab Roma',        '09:00:00','2025-07-16','base',       15.00, 8),
  ('Scuola Quattrozampe','09:30:00','2025-07-10','cuccioli',    9.00,10),
  ('Scuola Quattrozampe','11:00:00','2025-07-10','base',       13.00, 8),
  ('Scuola Quattrozampe','14:00:00','2025-07-17','agility',    18.00, 6),
  ('Dog Sport Napoli',   '08:30:00','2025-07-11','base',       11.00,10),
  ('Dog Sport Napoli',   '10:30:00','2025-07-11','avanzata',   17.00, 6),
  ('Dog Sport Napoli',   '10:00:00','2025-07-18','cuccioli',    9.00, 8);

-- ── CANE ──────────────────────────────────────────────────────────────────
INSERT INTO cane VALUES
  ('380260100000001','Fido',     'Labrador',           'grande', '2020-03-15','Molto vivace, ama giocare con la pallina',        'cliente1'),
  ('380260100000002','Luna',     'Chihuahua',          'piccola','2021-07-22','Timida con estranei, dolce con il padrone',       'cliente1'),
  ('380260100000003','Rex',      'Pastore Tedesco',    'grande', '2019-11-10','Addestrato, obbediente',                          'cliente2'),
  ('380260100000004','Pallina',  'Barboncino',         'piccola','2022-01-05','Vivacissima, tira al guinzaglio',                 'cliente2'),
  ('380260100000005','Birba',    'Beagle',             'media',  '2021-04-18','Golosa, segue i profumi ovunque',                 'cliente3'),
  ('380260100000006','Golia',    'San Bernardo',       'grande', '2018-09-01','Calmo, non gradisce i cani piccoli',              'cliente3'),
  ('380260100000007','Stella',   'Maltese',            'piccola','2023-02-14','Cucciola vivace, ancora in formazione',           'cliente4'),
  ('380260100000008','Rocky',    'Rottweiler',         'grande', '2020-06-30','Riservato con estranei, leale col padrone',       'cliente4'),
  ('380260100000009','Ciocco',   'Cocker Spaniel',     'media',  '2021-12-03','Allegro, abbaia spesso',                         'cliente5'),
  ('380260100000010','Neve',     'Siberian Husky',     'grande', '2022-08-19','Energico, ha bisogno di molto esercizio',         'cliente5'),
  ('380260100000011','Toffee',   'Golden Retriever',   'grande', '2019-05-25','Socievole con tutti, ottimo con bambini',         'cliente1'),
  ('380260100000012','Pepe',     'Volpino di Pomerania','piccola','2023-06-10','Molto vivace, abbaia molto',                     'cliente3');

-- ── PRENOTAZIONE ──────────────────────────────────────────────────────────
-- Prenotazioni dogsitter
INSERT INTO prenotazione (prezzo_pattuito, tipologia_attivita, n_microchip, username_cliente, username_dogsitter) VALUES
  (20.00, 'dogsitter', '380260100000001', 'cliente1', 'sitter1'),  -- 1
  (50.00, 'dogsitter', '380260100000003', 'cliente2', 'sitter2'),  -- 2
  (22.00, 'dogsitter', '380260100000005', 'cliente3', 'sitter3'),  -- 3
  (15.00, 'dogsitter', '380260100000008', 'cliente4', 'sitter4'),  -- 4
  (24.00, 'dogsitter', '380260100000009', 'cliente5', 'sitter5'),  -- 5
  (18.00, 'dogsitter', '380260100000011', 'cliente1', 'sitter2'),  -- 6
  (20.00, 'dogsitter', '380260100000002', 'cliente1', 'sitter1'),  -- 7
  (45.00, 'dogsitter', '380260100000010', 'cliente5', 'sitter4'),  -- 8
  (55.00, 'dogsitter', '380260100000006', 'cliente3', 'sitter3'),  -- 9
  (30.00, 'dogsitter', '380260100000007', 'cliente4', 'sitter5');  -- 10

-- Prenotazioni lezione
INSERT INTO prenotazione (prezzo_pattuito, tipologia_attivita, n_microchip, nome_campo, ora_lezione, data_lezione, username_cliente) VALUES
  (15.00,'lezione','380260100000001','Parco Rex',          '10:00:00','2025-07-07','cliente1'), -- 11
  (10.00,'lezione','380260100000004','Dog Academy',        '11:00:00','2025-07-08','cliente2'), -- 12
  (22.00,'lezione','380260100000005','AgiLab Roma',        '09:00:00','2025-07-09','cliente3'), -- 13
  ( 9.00,'lezione','380260100000007','Scuola Quattrozampe','09:30:00','2025-07-10','cliente4'), -- 14
  (11.00,'lezione','380260100000009','Dog Sport Napoli',   '08:30:00','2025-07-11','cliente5'), -- 15
  (20.00,'lezione','380260100000010','Parco Rex',          '14:00:00','2025-07-07','cliente5'), -- 16
  (16.00,'lezione','380260100000003','Dog Academy',        '14:30:00','2025-07-08','cliente2'), -- 17
  (18.00,'lezione','380260100000011','Parco Rex',          '10:00:00','2025-07-14','cliente1'), -- 18
  (20.00,'lezione','380260100000006','AgiLab Roma',        '11:30:00','2025-07-09','cliente3'), -- 19
  (13.00,'lezione','380260100000012','Scuola Quattrozampe','11:00:00','2025-07-10','cliente3'); -- 20

-- ── RECENSISCE ────────────────────────────────────────────────────────────
INSERT INTO recensisce VALUES
  ('cliente1','sitter1',5,'Fantastico! Fido era felicissimo, lo richiederò ancora.',       '2025-05-10'),
  ('cliente1','sitter2',4,'Molto professionale e puntuale.',                                '2025-05-18'),
  ('cliente2','sitter2',5,'Rex è tornato stanco e soddisfatto. Ottimo!',                   '2025-05-12'),
  ('cliente2','sitter3',4,'Gentile e premurosa, Pallina si è trovata bene.',               '2025-05-20'),
  ('cliente3','sitter3',5,'Birba ha adorato Chiara, super disponibile.',                   '2025-05-15'),
  ('cliente3','sitter4',3,'Buono ma non eccezionale, prezzi un po alti.',                  '2025-05-22'),
  ('cliente4','sitter4',4,'Davide è stato bravo con Rocky, cane non facile.',              '2025-05-17'),
  ('cliente4','sitter5',5,'Valeria è bravissima con i cani piccoli, Stella la ama!',      '2025-05-25'),
  ('cliente5','sitter1',4,'Laura affidabile e puntuale.',                                  '2025-05-19'),
  ('cliente5','sitter5',5,'Ciocco torna sempre felice da Valeria.',                        '2025-05-28');

-- ── ESECUZIONE_SERVIZIO ───────────────────────────────────────────────────
-- Associa le prenotazioni dogsitter (1-10) ai servizi erogati
INSERT INTO esecuzione_servizio VALUES
  (1,  1, 'sitter1', '09:00:00', '2025-07-01'),   -- dogsitting Fido/sitter1
  (2,  5, 'sitter2', '08:00:00', '2025-07-02'),   -- pensione Rex/sitter2
  (3,  1, 'sitter3', '10:00:00', '2025-07-03'),   -- dogsitting Birba/sitter3
  (4,  2, 'sitter4', '11:00:00', '2025-07-04'),   -- addestramento Rocky/sitter4
  (5,  1, 'sitter5', '09:30:00', '2025-07-05'),   -- dogsitting Ciocco/sitter5
  (6,  1, 'sitter2', '09:00:00', '2025-07-06'),   -- dogsitting Toffee/sitter2
  (7,  4, 'sitter1', '08:30:00', '2025-07-07'),   -- passeggiata Luna/sitter1
  (8,  5, 'sitter4', '08:00:00', '2025-07-05'),   -- pensione Neve/sitter4
  (9,  5, 'sitter3', '08:00:00', '2025-07-06'),   -- pensione Golia/sitter3
  (10, 3, 'sitter5', '10:00:00', '2025-07-03');   -- toelettatura Stella/sitter5


-- ============================================================
--  UTENTE MySQL per Spring Boot
-- ============================================================
CREATE USER IF NOT EXISTS 'dogsitteruser'@'localhost' IDENTIFIED BY 'DogsitterPassword1.';
GRANT ALL PRIVILEGES ON dogsitter.* TO 'dogsitteruser'@'localhost';
FLUSH PRIVILEGES;

-- Fine script
