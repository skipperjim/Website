CREATE TABLE `dexter`.`photos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(64) NOT NULL,
  `path` VARCHAR(256) NOT NULL,
  `description` VARCHAR(512) NULL,
  PRIMARY KEY (`id`));