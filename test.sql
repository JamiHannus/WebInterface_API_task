CREATE USER test WITH PASSWORD 'test2';


DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;


-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------


CREATE TABLE IF NOT EXISTS users (
  idUser VARCHAR(45) NOT NULL,
  email VARCHAR(254) NULL,
  password VARCHAR(60) NULL,
  firstName VARCHAR(45) NULL,
  lastName VARCHAR(45) NULL,
  PRIMARY KEY (idUser));

-- -----------------------------------------------------
-- Table `items`
-- -----------------------------------------------------


CREATE TABLE IF NOT EXISTS items (
  idItem SERIAL NOT NULL,
  title VARCHAR(45) NULL,
  description varchar(250) NULL,
  category VARCHAR(45) NULL,
  country VARCHAR(120) NULL,
  address VARCHAR(120) NULL,
  postCode VARCHAR(16) NULL,
  images JSON NULL,
  price INT NULL,
  datePosted DATE NULL,
  delmethod INT NULL,
  idUser VARCHAR(45) REFERENCES users,
  PRIMARY KEY (idItem));

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO test;