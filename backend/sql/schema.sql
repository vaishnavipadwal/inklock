USE inklock;

CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  vault_salt    VARBINARY(32) NULL,
  vault_check   VARCHAR(255) NULL,
  twofa_secret  VARCHAR(64) NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE books (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(150) NOT NULL,
  cover_color VARCHAR(20) DEFAULT '#4f46e5',
  is_locked   BOOLEAN DEFAULT FALSE,
  lock_hash   VARCHAR(255) NULL,
  is_deleted  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  book_id     INT NOT NULL,
  page_number INT NOT NULL,
  title       VARCHAR(150) DEFAULT 'Untitled',
  is_locked   BOOLEAN DEFAULT FALSE,
  lock_hash   VARCHAR(255) NULL,
  is_deleted  BOOLEAN DEFAULT FALSE,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY uq_book_page (book_id, page_number)
) ENGINE=InnoDB;

CREATE TABLE page_blocks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  page_id    INT NOT NULL,
  block_type ENUM('text','checklist','code','image') DEFAULT 'text',
  content    MEDIUMTEXT,
  position   INT NOT NULL DEFAULT 0,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE vault_entries (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  site_name    VARCHAR(150) NOT NULL,
  username_enc VARBINARY(512),
  password_enc VARBINARY(1024),
  notes_enc    VARBINARY(2048),
  iv           VARBINARY(16) NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;